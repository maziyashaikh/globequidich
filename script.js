(function () {
    "use strict";
  
    var app = {
      touchClick: "ontouchstart" in window || (window.DocumentTouch && document instanceof DocumentTouch) ? "touchstart" : "click",
      addClass: function (el, className) {
        if (Array.isArray(el)) {
          for (var i = 0; i < el.length; i++) {
            addingClass(el[i], className);
          }
        } else {
          addingClass(el, className);
        }
        function addingClass(el, cls) {
          if (el.classList) el.classList.add(cls);
          else if (!app.hasClass(el, cls)) el.className += " " + cls;
        }
      },
      removeClass: function (el, className) {
        if (Array.isArray(el)) {
          for (var i = 0; i < el.length; i++) {
            removingClass(el[i], className);
          }
        } else {
          removingClass(el, className);
        }
        function removingClass(el, cls) {
          if (el.classList) el.classList.remove(cls);
          else if (app.hasClass(el, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            el.className = el.className.replace(reg, " ");
          }
        }
      },
      hasClass: function (el, cls) {
        if (el.classList) {
          return el.classList.contains(cls);
        } else {
          return !!el.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
        }
      },
      findAncestor: function (el, sel) {
        while ((el = el.parentElement) && !(el.matches || el.matchesSelector).call(el, sel));
        return el;
      },
      findChild: function (element, className) {
        var foundElement = null,
          found;
        function recurse(element, className, found) {
          for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined ? el.className.split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
              if (classes[j] == className) {
                found = true;
                foundElement = element.childNodes[i];
                break;
              }
            }
            if (found) break;
            recurse(element.childNodes[i], className, found);
          }
        }
        recurse(element, className, false);
        return foundElement;
      },
      getPosition: function () {
        var doc = document.documentElement;
        var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        return [top, left];
      },
      onScreen: function (el) {
        var inScreen;
        var windowH = window.innerHeight;
        var elTop = el.getBoundingClientRect().top;
        if (parseInt(elTop) < windowH / 2) {
          inScreen = true;
        } else {
          inScreen = false;
        }
        return inScreen;
      },
      stores: document.querySelectorAll(".marker-data"),
      pins: [],
      mesh: ["Marker"],
      popUp: document.getElementById("stores-pop-up"),
      popUpName: document.querySelector("#stores-pop-up .name"),
      popUpDesc: document.querySelector("#stores-pop-up .desc"),
      popUpImg: document.querySelector("#stores-pop-up .image"),
    };
  
    function init() {
      var myearth;
  
      myearth = new Earth(document.getElementById("element"), {
        location: { lat: 18, lng: 50 },
        zoom: 1.05,
        light: "none",
        transparent: true,
        mapSeaColor: "RGBA(255,255,255,0.50)",
        mapLandColor: "#E0E0E0",
        mapBorderColor: "#E0E0E0",
        mapBorderWidth: 0.2,
        mapHitTest: true,
        autoRotate: true,
        autoRotateSpeed: 0.7,
        autoRotateDelay: 4000,
      });
  
      myearth.addEventListener("ready", function () {
        for (var i = 0; i < app.stores.length; i++) {
          var long = parseInt(app.stores[i].getAttribute("data-long"));
          var lat = parseInt(app.stores[i].getAttribute("data-lat"));
          var name = app.stores[i].getAttribute("data-name");
          var desc = app.stores[i].getAttribute("data-desc");
          var img = app.stores[i].getAttribute("data-img");
  
          var pin = this.addMarker({
            mesh: app.mesh,
            color: "#E63020",
            offset: 0,
            location: { lat: lat, lng: long },
            scale: 0.6,
            visible: true,
            hotspot: true,
            hotspotRadius: 0.3,
            hotspotHeight: 1.2,
            name: name,
            desc: desc,
            img: img,
            active: false,
          });
  
          app.pins.push(pin);
  
          pin.addEventListener(app.touchClick, function () {
            if (!this.active) {
              moveEarth(this);
  
              resetPins();
              app.popUpImg.style.backgroundImage = "url(" + this.img + ")";
              app.popUpName.innerHTML = this.name;
              app.popUpDesc.innerHTML = this.desc;
  
              app.addClass(document.body, "on-popup");
              this.active = true;
            }
          });
        }
        this.startAutoRotate();
      });
  
      function resetPins() {
        for (var i = 0; i < app.pins.length; i++) {
          app.pins[i].active = false;
        }
      }
  
      var startLocation, rotationAngle;
  
      myearth.addEventListener("dragstart", function () {
        startLocation = myearth.location;
      });
  
      myearth.addEventListener("dragend", function () {
        rotationAngle = Earth.getAngle(startLocation, myearth.location);
      });
  
      function moveEarth(store) {
        myearth.goTo(store.location, { duration: 250, relativeDuration: 70 });
      }
    }
  
    document.addEventListener("DOMContentLoaded", function (event) {
      init();
    });
  })();
  