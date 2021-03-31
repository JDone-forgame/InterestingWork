

function startExample7() {
    // 围绕某个 x,y,z轴测试
    var renderer;
    var stats;

    function initThree() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        renderer.setClearColor('black', 1.0);

        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.right = '0px';
        stats.domElement.style.top = '0px';
        document.getElementById('canvas-frame').appendChild(stats.domElement);
    }

    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 100;
        camera.position.y = 300;
        camera.position.z = 600;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });
    }

    var scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    var light;
    function initLight() {
        light = new THREE.AmbientLight(0xFF0000);
        light.position.set(100, 100, 200);
        scene.add(light);

    }

    var cube;
    var mesh;
    function initObject() {

        var geometry = new THREE.BoxGeometry(100, 100, 100);

        for (var i = 0; i < geometry.faces.length; i += 2) {

            var hex = Math.random() * 0xffffff;
            geometry.faces[i].color.setHex(hex);
            geometry.faces[i + 1].color.setHex(hex);

        }

        var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position = new THREE.Vector3(0, 0, 0);
        scene.add(mesh);


    }

    // 绘制网格
    function initGrid() {
        // 网格的边长是1000，每个小网格的边长是50
        var helper = new THREE.GridHelper(1000, 50);
        // 网格线的颜色一头是0x0000ff，另一头是0x808080。线段中间的颜色取这两个颜色的插值颜色。
        helper.setColors('#8A2BE2', '#E1FFFF');
        scene.add(helper);
    }
    // 帧循环、游戏循环
    function animation() {
        // mesh.rotation.y +=0.01;

        // mesh.rotateY(0.01);
        mesh.rotateZ(0.01);

        renderer.render(scene, camera);
        requestAnimationFrame(animation);

    }

    initThree();
    initCamera();
    initScene();
    initLight();

    initObject();
    initGrid();

    animation();

}

