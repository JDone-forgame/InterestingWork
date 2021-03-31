// 启动
function startExample2() {
    // 渲染器
    var renderer;
    function initThree() {
        // 宽
        width = document.getElementById('canvas-frame').clientWidth;
        // 高
        height = document.getElementById('canvas-frame').clientHeight;

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        renderer.setSize(width, height);
        document.getElementById('canvas-frame').appendChild(renderer.domElement);

        renderer.setClearColor("black", 1.0);
    }

    // 相机
    var camera;
    function initCamera() {
        camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        camera.position.x = 0;
        camera.position.y = 1000;
        camera.position.z = 0;
        camera.up.x = 0;
        camera.up.y = 0;
        camera.up.z = 1;
        camera.lookAt({
            x: 0,
            y: 0,
            z: 0
        });
    }

    // 场景
    var scene;
    function initScene() {
        scene = new THREE.Scene();
    }

    // 光源
    var light;
    function initLight() {
        light = new THREE.DirectionalLight(0xFF0000, 1.0, 0);
        light.position.set(100, 100, 200);
        scene.add(light);
    }

    // 物体
    var cube;
    function initObject() {

        // 声明一个几何体
        var geometry = new THREE.Geometry();
        // Parameters是一个定义材质外观的对象，它包含多个属性来定义材质，这些属性是：
        // Color：线条的颜色，用16进制来表示，默认的颜色是白色。
        // Linewidth：线条的宽度，默认时候1个单位宽度。
        // Linecap：线条两端的外观，默认是圆角端点，当线条较粗的时候才看得出效果，如果线条很细，那么你几乎看不出效果了。
        // Linejoin：两个线条的连接点处的外观，默认是“round”，表示圆角。
        // VertexColors：定义线条材质是否使用顶点颜色，这是一个boolean值。意思是，线条各部分的颜色会根据顶点的颜色来进行插值。
        // Fog：定义材质的颜色是否受全局雾效的影响。
        var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

        var color1 = new THREE.Color(0x444444), color2 = new THREE.Color(0xFF0000);

        // 线的材质可以由2点的颜色决定
        var p1 = new THREE.Vector3(-100, 0, 100);
        var p2 = new THREE.Vector3(100, 0, -100);

        geometry.vertices.push(p1);
        geometry.vertices.push(p2);

        // geometry中colors表示顶点的颜色，必须材质中vertexColors等于THREE.VertexColors 时，颜色才有效
        geometry.colors.push(color1, color2);

        // 一个参数是几何体geometry，里面包含了2个顶点和顶点的颜色。第二个参数是线条的材质，或者是线条的属性，表示线条以哪种方式取色。第三个参数是一组点的连接方式。
        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        scene.add(line);
    }

    // 动态渲染
    function render() {
        renderer.clear();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    render();
}