/**
 * auto generate by tableconvert
 */

/**
 * SeEnumItemssItemType generate in[Mon Jan 04 2021 18:36:04 GMT+0800 (GMT+08:00)] 
 */
export enum SeEnumItemssItemType{ 
      DanYao=1,
      GongFa=2,
}


/**
 * SeEnumRlevelsLevelName generate in[Mon Jan 04 2021 18:36:04 GMT+0800 (GMT+08:00)] 
 */
export enum SeEnumRlevelsLevelName{ 
      LianQi=1,
      ZhuJi=2,
      JieDan=3,
      YuanYing=4,
}


/**
 * SeResAtkMethods generate in[Mon Jan 04 2021 18:36:04 GMT+0800 (GMT+08:00)] 
 */
export interface SeResAtkMethods{ 
      sID:string;
      sAtkName:string;
      sNeedElements:string;
      sHandleSpeed:string;
      sMaxLevel:string;
      sQuality:string;
      sUpAddSpeed:string;
}


/**
 * SeResItems generate in[Mon Jan 04 2021 18:36:04 GMT+0800 (GMT+08:00)] 
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
 * SeResRlevel generate in[Mon Jan 04 2021 18:36:04 GMT+0800 (GMT+08:00)] 
 */
export interface SeResRlevel{ 
      sID:string;
      sLevelName:SeEnumRlevelsLevelName;
      sNeedReiki:string;
      sEachGroup:string;
}


