function startExample1() {
    //------------------------------场景-----------------------------------------------
    // 创建场景对象Scene
    var scene = new THREE.Scene();

    // 创建网格模型
    // 创建一个球体几何对象
    // var geometry = new THREE.SphereGeometry(60, 40, 40); 
    // 创建一个立方体几何对象Geometry
    var geometry = new THREE.BoxGeometry(100, 100, 100);

    // 材质对象Material
    var material = new THREE.MeshLambertMaterial({
        color: 0xFF4500
    });

    // 网格模型对象Mesh
    var mesh = new THREE.Mesh(geometry, material);

    // 网格模型添加到场景中
    scene.add(mesh);

    //------------------------------光源-----------------------------------------------
    // 点光源
    var point = new THREE.PointLight(0xFFFFFF);

    // 点光源位置
    point.position.set(600, 200, 300);

    // 点光源添加到场景中
    scene.add(point);

    // 环境光
    var ambient = new THREE.AmbientLight(0x444444);

    scene.add(ambient);


    //------------------------------相机-----------------------------------------------

    // 窗口宽度
    var width = window.innerWidth;
    // 窗口高度
    var height = window.innerHeight;
    // 窗口宽高比
    var k = width / height;
    // 三维场景显示范围控制系数，系数越大，显示的范围越大
    var s = 200;

    // 创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);

    // 设置相机位置
    camera.position.set(200, 300, 200);

    // 设置相机方向(指向的场景对象)
    camera.lookAt(scene.position);

    //------------------------------渲染-----------------------------------------------

    // 创建渲染器对象
    var renderer = new THREE.WebGLRenderer();

    // 设置渲染区域尺寸
    renderer.setSize(width, height);

    // 设置背景颜色
    renderer.setClearColor('black', 1);

    // body元素中插入canvas对象 domElement元素，表示渲染器中的画布
    document.getElementById('canvas-frame').appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);

    // 执行渲染操作 指定场景、相机作为参数
    renderer.render(scene, camera);
}