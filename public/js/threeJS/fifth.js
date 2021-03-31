

function startExample5() {

    var renderer;
    function initThree() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        renderer.setClearColor('#696969', 1.0);
    }

    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        camera.position.x = 600;
        camera.position.y = 0;
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
        // 在场景中没有任何光源的情况下，物体不能反射光源到人的眼里，所以物体应该是黑色的

        // 环境光
        // Lambert材质会受环境光的影响，呈现环境光的颜色，与材质本身颜色关系不大。
        light = new THREE.AmbientLight('#FFA500');
        // 可以把环境光放在任何一个位置，它的光线是不会衰减的，是永恒的某个强度的一种光源。
        light.position.set(100, 100, 200);
        scene.add(light);

        // 方向光
        // 方向由位置和原点（0,0,0）来决定，方向光只与方向有关，与离物体的远近无关
        // 第二个参数是光源强度，你可以改变它试一下
        light = new THREE.DirectionalLight('green', 0.5);
        // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
        // light.position.set(0,0,1);
        light.position.set(1, 0, 5);
        scene.add(light);

        // 点光源
        light = new THREE.PointLight('blue');
        light.position.set(0, 0, 50);
        scene.add(light);

    }

    var cube;
    function initObject() {
        // 单个物体
        // var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);

        // // Lambert材质
        // var material = new THREE.MeshLambertMaterial({ color: '0xFFFFFF' });

        // var mesh = new THREE.Mesh(geometry, material);
        // mesh.position = new THREE.Vector3(0, 0, 0);
        // scene.add(mesh);

        // 多个物体
        var geometry = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        scene.add(mesh);

        var geometry2 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        var material2 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh2 = new THREE.Mesh(geometry2, material2);
        mesh2.position.set(-300, 0, 0);
        scene.add(mesh2);

        var geometry3 = new THREE.CubeGeometry(200, 100, 50, 4, 4);
        var material3 = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        var mesh3 = new THREE.Mesh(geometry3, material3);
        mesh3.position.set(0, -150, 0);
        scene.add(mesh3);

        var mesh4 = new THREE.Mesh(geometry3, material3);
        mesh4.position.set(0, 150, 0);
        scene.add(mesh4);

        var mesh5 = new THREE.Mesh(geometry3, material3);
        mesh5.position.set(300, 0, 0);
        scene.add(mesh5);

        var mesh6 = new THREE.Mesh(geometry3, material3);
        mesh6.position.set(0, 0, -100);
        scene.add(mesh6);
    }

    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    renderer.clear();
    renderer.render(scene, camera);
}