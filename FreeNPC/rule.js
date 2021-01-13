$(function () {
    const flashTime = 1000 / 2;
    setInterval(() => {
        update();
    }, flashTime);



    function update() {
        // randomNPC()
        walk()
    }

    function randomNPC() {
        // 删除所有已有NPC
        $("div").remove(".npc");

        // 新增NPC
        let randNpcId = 'npcId' + (Math.floor(Math.random() * 1001));
        $("#activeRange").append('<div id="' + randNpcId + '" class="npc">NPC</div>');

        // 随机改变位置
        let left = Math.floor(Math.random() * 51)
        $("#"+randNpcId).css('left',left+'rem')
    }

    function walk() {
        let left = Math.floor(Math.random() * 51)
        $('#npc_heya').css('left',left+'rem')
    }




















})