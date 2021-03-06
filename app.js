(function () {
  if (!window.addEventListener) return // Check for IE9+

  const {tinycolor} = window
  const CONTAINER_ID = "eager-particles-js"
  const getComputedStyle = document.defaultView.getComputedStyle.bind(document.defaultView)
  let options = INSTALL_OPTIONS
  let element

  function getParticleColor() {
    let particleColor

    if (options.particleColor) {
      particleColor = tinycolor(options.particleColor)
    }
    else {
      const backgroundColor = options.backgroundColor || getComputedStyle(document.body).backgroundColor
      const components = tinycolor(backgroundColor).toHsl()

      // Find contrasting color.
      components.l = Math.abs((components.l + 0.5) % 1) + (1 - components.s) * 0.1
      particleColor = tinycolor(components)
    }


    return {
      hex: particleColor.toHexString(),
      rgb: particleColor.toRgb()
    }
  }

  function getInteractivityEvents() {
    return {
      onhover: {
        enable: options.interaction.onHover !== "none",
        mode: options.interaction.onHover
      },
      onclick: {
        enable: options.interaction.onClick !== "none",
        mode: options.interaction.onClick
      },
      resize: true
    }
  }

  function updateElement() {
    const particleColor = getParticleColor()

    element = Eager.createElement({selector: "body", method: "prepend"}, element)
    element.id = CONTAINER_ID

    if (element.parentNode.tagName !== "BODY") {
      element.parentNode.setAttribute("data-particle-parent", "")
    }

    element.style.backgroundColor = options.backgroundColor

    window.particlesJS(CONTAINER_ID, {
      particles: {
        number: {
          value: options.fewerParticles ? 40 : 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: particleColor.hex
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000"
          },
          polygon: {
            nb_sides: 5
          }
        },
        opacity: {
          value: 0.8,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 160,
          color: particleColor.hex,
          opacity: 0.45,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: options.behavior.outMode,
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "window",
        events: getInteractivityEvents(),
        modes: {
          grab: {
            distance: 200,
            line_linked: {
              opacity: 0.4
            }
          },
          bubble: {
            distance: 350,
            size: 3.1,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          repulse: {
            distance: 80,
            duration: 0.3
          },
          push: {
            particles_nb: 4
          },
          remove: {
            particles_nb: 2
          }
        }
      },
      retina_detect: true
    })
  }

  if (document.readyState === "loading") {
    window.addEventListener("load", updateElement)
  }
  else {
    updateElement()
  }

  window.INSTALL_SCOPE = {
    setColors(nextOptions) {
      options = nextOptions

      if (!window.pJSDom) {
        updateElement()
        return
      }

      if (element) element.style.backgroundColor = options.backgroundColor

      const {hex, rgb} = getParticleColor()

      window.pJSDom.forEach(({pJS: {particles}}) => {
        particles.color.value = hex
        particles.color.rgb = rgb

        particles.line_linked.color = hex
        particles.line_linked.color_rgb_line = rgb
      })
    },
    setCommon(nextOptions) {
      options = nextOptions

      if (!window.pJSDom) {
        updateElement()
        return
      }

      window.pJSDom.forEach(({pJS}) => {
        pJS.particles.move.out_mode = options.behavior.outMode
        pJS.interactivity.events = getInteractivityEvents()
      })
    },
    setResetworthy(nextOptions) {
      options = nextOptions

      if (window.pJSDom) {
        window.pJSDom.forEach($ => $.pJS.fn.vendors.destroypJS())
      }
      updateElement()
    }
  }
}())
