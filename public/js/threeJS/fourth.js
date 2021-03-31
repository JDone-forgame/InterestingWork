
function startExample4() {
    var renderer;
    // 性能监视器
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
        // 透视投影
        // 第一个参数视角fov 0 < fov < 179
        camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
        // 正投影
        // camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 10, 1000 );

        camera.position.x = 0;
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
        // 环境光
        light = new THREE.AmbientLight('white');

        light.position.set(100, 100, 200);
        scene.add(light);

        // 点光源
        // Color：光的颜色;
        // Intensity：光的强度，默认是1.0,就是说是100%强度的灯光;
        // distance：光的距离，从光源所在的位置，经过distance这段距离之后，光的强度将从Intensity衰减为0。 默认情况下，这个值为0.0，表示光源强度不衰减。
        light = new THREE.PointLight('#7FFFAA', 1, 0);
        light.position.set(0, 0, 100);
        scene.add(light);

        // 聚光灯
        // Hex：聚光灯发出的颜色，如0xFFFFFF
        // Intensity：光源的强度，默认是1.0，如果为0.5，则强度是一半，意思是颜色会淡一些。和上面点光源一样。
        // Distance：光线的强度，从最大值衰减到0，需要的距离。 默认为0，表示光不衰减，如果非0，则表示从光源的位置到Distance的距离，光都在线性衰减。到离光源距离Distance时，光源强度为0.
        // Angle：聚光灯着色的角度，用弧度作为单位，这个角度是和光源的方向形成的角度。
        // exponent：光源模型中，衰减的一个参数，越大衰减约快。
        light = new THREE.SpotLight('red', 1, 0, 15, 0);
        light.position.set(0, 0, 150);
        scene.add(light);
    }

    var cube;
    var mesh;
    function initObject() {
        var geometry = new THREE.CylinderGeometry(100, 150, 400);
        var material = new THREE.MeshLambertMaterial({ color: 'green' });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position = new THREE.Vector3(0, 0, 0);
        scene.add(mesh);
    }

    // 动画引擎
    function initTween() {
        new TWEEN.Tween(mesh.position)
            .to({ x: -300 }, 3000).repeat(Infinity).start();
    }


    // 第一种方式：相机动
    let operator = -1;

    // function animation() {
    //     //renderer.clear();

    //     if (camera.position.x == 50) {
    //         operator = -1;
    //     }

    //     if (camera.position.x == -50) {
    //         operator = 1;
    //     }

    //     camera.position.x = camera.position.x + operator * 1;

    //     console.log(camera.position)

    //     renderer.render(scene, camera);

    //     requestAnimationFrame(animation);
    // }

    // 第二种方式：物体动
    // function animation() {
    //     if (mesh.position.x == 200) {
    //         operator = -1;
    //     }

    //     if (mesh.position.x == -200) {
    //         operator = 1;
    //     }

    //     mesh.position.x = mesh.position.x + operator * 1;
    //     renderer.render(scene, camera);
    //     requestAnimationFrame(animation);

    //     stats.update();
    // }

    // 使用动画引擎
    function animation() {
        renderer.render(scene, camera);
        requestAnimationFrame(animation);

        stats.update();
        TWEEN.update();
    }




    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    animation();
    initTween();
}

