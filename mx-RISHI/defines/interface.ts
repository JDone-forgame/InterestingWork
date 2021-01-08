/**
 * auto generate by tableconvert
 */

/**
 * SeEnumItemssItemType generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export enum SeEnumItemssItemType{ 
      DanYao=1,
      GongFa=2,
      CaiLiao=3,
      ZhuangBei=4,
}


/**
 * SeEnumRlevelsLevelName generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export enum SeEnumRlevelsLevelName{ 
      LianQi=1,
      ZhuJi=2,
      JieDan=3,
      YuanYing=4,
}


/**
 * SeResAtkFight generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResAtkFight{ 
      sID:string;
      sAtkName:string;
      sAtkType:string;
      sAtkRangeNear:string;
      sAtkRangeFar:string;
      sTargetSelf:string;
      sTargetEnemy:string;
      sNearEffectSelf:string;
      sFarEffectSelf:string;
      sNearEffectEnemy:string;
      sFarEffectEnemy:string;
}


/**
 * SeResAtkMethods generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResAtkMethods{ 
      sID:string;
      sAtkName:string;
      sNeedElements:string;
      sHandleSpeed:string;
      sMaxLevel:string;
      sQuality:string;
      sUpAddSpeed:string;
      sAtkSkills:string;
}


/**
 * SeResEquip generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResEquip{ 
      sID:string;
      sEuipName:string;
      sEffect:string;
      sAddAtk:string;
      sAddDef:string;
      sAddEle:string;
      sAddSpeed:string;
      sAddHealth:string;
      sAddCri:string;
      sAddCsd:string;
      sLocation:string;
      sLimitRlevel:string;
      sLimitEle:string;
}


/**
 * SeResGlobal generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResGlobal{ 
      sID:string;
      sGlobalSet:string;
      sGlobalValue:string;
      sExplain:string;
}


/**
 * SeResItems generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResItems{ 
      sID:string;
      sItemName:string;
      sItemType:SeEnumItemssItemType;
      sDescribe:string;
      sEffect:string;
      sQuality:string;
      sImgUrl:string;
}


/**
 * SeResLuckChance generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResLuckChance{ 
      sID:string;
      sLType:string;
      sWeight:string;
      sItemId:string;
      sDescri:string;
}


/**
 * SeResRlevel generate in[Fri Jan 08 2021 15:34:59 GMT+0800 (GMT+08:00)] 
 */
export interface SeResRlevel{ 
      sID:string;
      sLevelName:SeEnumRlevelsLevelName;
      sNeedReiki:string;
      sEachGroup:string;
}


