// 成就类型
export enum SeEnumAchievementeType {
      IU_ZhuXian = 1,
      IU_FenZhi = 2
}

// 成就信息
export interface SeResAchievement{ 
      sID:string;
      // 任务类型编号
      eType:SeEnumAchievementeType;
      // 提示描述
      asDescribe:Array<string>;
      // 条件数量
      aiCondition:Array<number>;
      // 成就奖励
      asGiftitems:Array<string>;
}

// 任务类型
export enum SeEnumTaskeTaskType{ 
      IU_ZhuXian = 1,
      IU_FenZhi = 2,
      DingShiDengLu = 3,
      YaoQingHaoYou = 4
}

// 任务信息
export interface SeResTask{ 
      sID:string;
      // 标题
      sTaskTitle:string;
      // 任务类型编号
      eTaskType:SeEnumTaskeTaskType;
      // 任务类型编号
      sCondition:string;
      // 奖励
      asTaskitems:Array<string>;
      // 提示描述
      sDescribe:string;
      // 任务顺序
      iTaskOrder:number;
      // 使用icon
      sIcon:string;
      // 相关跳转
      sJumpType:string;
      // 提示顺序
      iPrompt:number;
}