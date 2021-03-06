// 登录信息
export interface ifLoginInfo {
    gameId: string,
    password: string,
    nickName: string,
}

// 注册信息
export interface ifRegInfo {
    gameId: string,
    password: string,
    nickName: string,
}



// 道具更新方式
export enum eUType {
    // 累加
    add = 0,
    // 覆盖
    set = 1,
    // 取最大
    max = 2,
    // 取最小
    min = 3,
}

// 五行信息
export enum eElementName {
    金 = 'Metal',
    木 = 'Wood',
    水 = 'Water',
    火 = 'Fire',
    土 = 'Earth',
}

export interface ifElements {
    Metal: number,
    Wood: number,
    Water: number,
    Fire: number,
    Earth: number,
}

// 修行信息
export enum ePractice {
    修行速度 = 'handledSpeed',
    真气 = 'reiki',
    上次保存时间 = 'lastSave',
    修行等级 = 'rLevel',
}

export interface ifPractice {
    handledSpeed: number,
    reiki: number,
    lastSave: number,
    // 修炼阶段名称
    rLevelName: string,
    // 修炼阶段层数
    rLevelLayer: number,
    // 修炼总称
    rLevel: string,
    // 当前每秒所增加的灵气
    earnSpeed: number,
    // 精力
    energy: number,
    // 神识
    spirit: number,
}

// 功法信息
export enum eAtkMethod {
    功法ID = 'atkId',
    功法名称 = 'atkName',
    功法等级 = 'atkLevel',
}

export interface ifAtkMethod {
    atkId: string,
    atkName: string,
    atkLevel: number,
}

// 基础信息
export interface ifBaseInfo {
    sex: string,
    headUrl: string
}

export interface ifLuckChance {
    totalLC: number,
    normal: number,
    spring: number,
    summer: number,
    autumn: number,
    winter: number,
    luckday: number,
}

// 战斗相关
export interface ifAtkAbout {
    health: number,
    defense: ifFightEle,
    atkEle: ifFightEle,
    // 通用技能
    learned: string[],
    // 功法技能
    atkSkill: string[],
    // 装备技能
    equipSkill: string[],
    cri: number,
    csd: number,
    speed: number,
}

// 装备
export interface ifEquipment {
    // 头饰
    helmet: string,
    // 衣服
    clothes: string,
    // 鞋子
    shoes: string,
    // 武器
    weapons: string,
    // 饰品1
    ornament1: string,
    // 饰品2
    ornament2: string,
    // 饰品3
    ornament3: string,

    totalCri: number;
    totalCsd: number;
    totalAtk: ifFightEle,
    totalDef: ifFightEle,
    totalSpe: number,
    totalHea: number,
}

// 战斗元素属性
export interface ifFightEle {
    Wood: number,
    Metal: number,
    Fire: number,
    Water: number,
    Earth: number,
    Physical: number,
}