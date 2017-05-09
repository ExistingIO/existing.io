$(document).ready(function() {
  var xxx_three = false;
  var xxx_boot = false;

  var  rata = true;

  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    //rata = false;
  }

  $.getScript("js/three.min.js", function(){

      $.getScript("js/SimplexNoise.js", function(){

        $.getScript("js/threex.terrain.js", function(){

          xxx_three = true;

          check();

        });

      });

   });


  $.getScript("http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js", function(){

    xxx_boot = true;

    check();

  });

  function check(){
    if(xxx_boot && xxx_three){
      var testing = true;
      var renderer  = new THREE.WebGLRenderer({
          antialias : true,
          alpha     : true
        });
      /* Fullscreen */
        renderer.setSize( window.innerWidth, window.innerHeight );
      /* Append to HTML */
        document.getElementById("lander").appendChild( renderer.domElement );
        var onRenderFcts= [];
        var scene = new THREE.Scene();
        var camera  = new THREE.PerspectiveCamera(25, window.innerWidth /    window.innerHeight, 0.01, 1000);
      /* Play around with camera positioning */
        camera.position.z = 15; 
        camera.position.y = 2;
      /* Fog provides depth to the landscape*/
        scene.fog = new THREE.Fog('lightgray', 0, 45);
        (function(){
          var light = new THREE.AmbientLight( 0x202020 )
          scene.add( light )
          var light = new THREE.DirectionalLight('white', 5)
          light.position.set(0.5, 0.0, 2)
          scene.add( light )
          var light = new THREE.DirectionalLight('white', 0.75*2)
          light.position.set(-0.5, -0.5, -2)
          scene.add( light )    
        })()
       
        var heightMap = THREEx.Terrain.allocateHeightMap(256,256);
        THREEx.Terrain.simplexHeightMap(heightMap);
        var geometry  = THREEx.Terrain.heightMapToPlaneGeometry(heightMap);
        THREEx.Terrain.heightMapToVertexColor(heightMap, geometry);
        
         /****/
      /* Wireframe built-in color is white, no need to change that */
        var material  = new THREE.MeshBasicMaterial({
          wireframe: true
        });
        var mesh  = new THREE.Mesh( geometry, material );
        scene.add( mesh );
        mesh.lookAt(new THREE.Vector3(0,1,0));

        /****/

      /* Play around with the scaling */
        mesh.scale.y  = 3.5;
        mesh.scale.x  = 3;
        mesh.scale.z  = 0.20;
        mesh.scale.multiplyScalar(10);
      /* Play around with the camera */
        onRenderFcts.push(function(delta, now){
          mesh.rotation.z += 0.2 * delta; 
        })
        onRenderFcts.push(function(){
          renderer.render( scene, camera );   
        })

        var lastTimeMsec= null
        requestAnimationFrame(function animate(nowMsec){
            requestAnimationFrame( animate );
            lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
            var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
            lastTimeMsec  = nowMsec
          if(testing){
            onRenderFcts.forEach(function(onRenderFct){
              onRenderFct(deltaMsec/1000, nowMsec/1000)
            })
            if(!rata){
              testing = false;
            }
          }
        })


      var prefix = 'We work with ';
      var skills = [
          'local talent',
          'mobile apps',
          'JavaScript',
          'HTML & CSS',
          'jQuery',
          'Node.js',
          'Symfony',
          'Composer',
          'PHP & MySQL',
          'passion & love',
          'YOU'
      ].map(function (s) { return s + "."; });
      var delay = 2;
      var step = 1;
      var tail = 5;
      var timeout = 75;
      var p = document.getElementById('p');
      var colors = [
          "rgb(110,64,170)",
          "rgb(150,61,179)",
          "rgb(191,60,175)",
          "rgb(228,65,157)",
          "rgb(254,75,131)",
          "rgb(255,94,99)",
          "rgb(255,120,71)",
          "rgb(251,150,51)",
          "rgb(226,183,47)",
          "rgb(198,214,60)",
          "rgb(175,240,91)",
          "rgb(127,246,88)",
          "rgb(82,246,103)",
          "rgb(48,239,130)",
          "rgb(29,223,163)",
          "rgb(26,199,194)",
          "rgb(35,171,216)",
          "rgb(54,140,225)",
          "rgb(76,110,219)",
          "rgb(96,84,200)",
      ];
      function getRandomColor() {
          return colors[Math.floor(Math.random() * colors.length)];
      }
      function getRandomChar() {
          return String.fromCharCode(Math.random() * (127 - 33) + 33);
      }
      function getRandomColoredString(n) {
          var fragment = document.createDocumentFragment();
          for (var i = 0; i < n; i++) {
              var char = document.createElement('span');
              char.textContent = getRandomChar();
              char.style.color = getRandomColor();
              fragment.appendChild(char);
          }

          return fragment;
      }
      /** Global State */
      var $ = {
          text: '',
          prefixP: -tail,
          skillI: 0,
          skillP: 0,
          direction: 'forward',
          delay: delay,
          step: step
      };
      function render() {
          var skill = skills[$.skillI];
          if ($.step) {
              $.step--;
          }
          else {
              $.step = step;
              if ($.prefixP < prefix.length) {
                  if ($.prefixP >= 0) {
                      $.text += prefix[$.prefixP];
                  }
                  $.prefixP++;
              }
              else {
                  if ($.direction === 'forward') {
                      if ($.skillP < skill.length) {
                          $.text += skill[$.skillP];
                          $.skillP++;
                      }
                      else {
                          if ($.delay) {
                              $.delay--;
                          }
                          else {
                              $.direction = 'backward';
                              $.delay = delay;
                          }
                      }
                  }
                  else {
                      if ($.skillP > 0) {
                          $.text = $.text.slice(0, -1);
                          $.skillP--;
                      }
                      else {
                          $.skillI = ($.skillI + 1) % skills.length;
                          $.direction = 'forward';
                      }
                  }
              }
          }
          p.textContent = $.text;
          p.appendChild(getRandomColoredString($.prefixP < prefix.length ?
              Math.min(tail, tail + $.prefixP) :
              Math.min(tail, skill.length - $.skillP)));
          setTimeout(render, timeout);
      }
      setTimeout(render, 500);

      jQuery('[data-toggle="popover"]').popover({
          trigger: 'hover',
              'placement': 'top'
      });

      jQuery(document).scroll(function() {
         if(jQuery(window).scrollTop() === 0) {
           testing = true;
         } else {
            testing = false;
         }
      });
      jQuery(".load-site").fadeOut("slow");
    }
  }


});