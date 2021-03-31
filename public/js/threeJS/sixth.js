function startExample6() {
    return alert('暂时有点问题！');


    var camera, scene, renderer;
    var mesh;
    function init() {
        width = document.getElementById('canvas-frame').clientWidth;
        height = document.getElementById('canvas-frame').clientHeight;
        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);
        renderer.setClearColor('#696969', 1.0);

        //
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 400;
        scene = new THREE.Scene();


        // 画一个平面
        var geometry = new THREE.PlaneGeometry(500, 300, 1, 1);
        // 纹理坐标由顶点的uv成员来表示，uv被定义为一个二维向量THREE.Vector2()
        geometry.vertices[0].uv = new THREE.Vector2(0, 0);
        geometry.vertices[1].uv = new THREE.Vector2(2, 0);
        geometry.vertices[2].uv = new THREE.Vector2(2, 2);
        geometry.vertices[3].uv = new THREE.Vector2(0, 2);

        // 纹理坐标怎么弄
        // 第二个参数为null，表示时候要传入一个纹理坐标参数，来覆盖前面在geometry中的参数。
        // 第三个表示一个回调函数，表示成功加载纹理后需要执行的函数，参数t是传入的texture。
        // var texture = THREE.ImageUtils.loadTexture("/public/img/threeJS/test.jpg", null, function (t) {
        // });

        var texture = new THREE.TextureLoader("/public/img/threeJS/test.jpg", function () {
            renderer.render(scene, camera);
        });

        //创建网格;
        var geometry = new THREE.BoxGeometry(100, 100, 100);
        var material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);


        // var material = new THREE.MeshBasicMaterial({ map: texture });
        // var mesh = new THREE.Mesh(geometry, material);
        // scene.add(mesh);

        // //
        // window.addEventListener('resize', onWindowResize, false);

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    init();
    animate();
}

