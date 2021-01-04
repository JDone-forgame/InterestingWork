import { eElReaction } from "../../../defines/fight";

export class Fight {
    // 计算暴击
    static crit(damage, cri, csd) {
        let r = Math.floor(Math.random() * 101);
        return damage = cri >= r ? Math.floor(damage * (csd / 100)) : damage
    }

    // 元素反应
    static elementReaction(mainElement, reactElement) {
        let reaction = '';
        let reactionEffect = 0;
        if (
            (mainElement == 'Fire' && reactElement == 'Metal') ||
            (mainElement == 'Metal' && reactElement == 'Wood') ||
            (mainElement == 'Wood' && reactElement == 'Earth') ||
            (mainElement == 'Earth' && reactElement == 'Water') ||
            (mainElement == 'Water' && reactElement == 'Fire')
        ) {
            reaction = eElReaction.克制;
            reactionEffect = 1.5;
        }
        else if (
            (mainElement == 'Fire' && reactElement == 'Water') ||
            (mainElement == 'Metal' && reactElement == 'Fire') ||
            (mainElement == 'Wood' && reactElement == 'Metal') ||
            (mainElement == 'Earth' && reactElement == 'Wood') ||
            (mainElement == 'Water' && reactElement == 'Earth')
        ) {
            reaction = eElReaction.被克制;
            reactionEffect = 0.75;
        }
        else if (
            (mainElement == 'Fire' && reactElement == 'Earth') ||
            (mainElement == 'Metal' && reactElement == 'Water') ||
            (mainElement == 'Wood' && reactElement == 'Fire') ||
            (mainElement == 'Earth' && reactElement == 'Metal') ||
            (mainElement == 'Water' && reactElement == 'Wood')
        ) {
            reaction = eElReaction.刷新CD
        }
        else if (
            (mainElement == 'Fire' && reactElement == 'Wood') ||
            (mainElement == 'Metal' && reactElement == 'Earth') ||
            (mainElement == 'Wood' && reactElement == 'Water') ||
            (mainElement == 'Earth' && reactElement == 'Fire') ||
            (mainElement == 'Water' && reactElement == 'Metal')
        ) {
            reaction = eElReaction.变为物理或无效攻击
        }
        else {
            reaction = eElReaction.无反应
        }
        return { reaction: reaction, reactionEffect: reactionEffect };
    }

    // 元素伤害加成
    static reactDamage(damage, attackedOne) {
        let reactDescri = this.elementReaction(damage.elementType, attackedOne.elementType);

        switch (reactDescri.reaction) {
            case eElReaction.克制:
                damage.damage = damage.damage * reactDescri.reactionEffect;
                break;
            case eElReaction.被克制:
                damage.damage = damage.damage * reactDescri.reactionEffect;
                break;
            case eElReaction.刷新CD:
                attackedOne.elementTime = attackedOne.elementDefTime;
                break;
            case eElReaction.变为物理或无效攻击:
                if (damage.attType == 1) {
                    damage.elementType = 'Physical';
                }
                else if (damage.attType == 2) {
                    damage.damage = 0;
                }
                break;
            case eElReaction.无反应:
                break;
        }

        return { damage: damage, attackedOne: attackedOne }
    }


    // let damageA = {
    //     elementType: 'Wood',
    //     damage: 500,
    //     attType: 1
    // }
    // let B = {
    //     elementType: 'Fire',
    //     elementTime: 5,
    //     elementDefTime: 10
    // }

    // cri: 50    暴击率%
    // csd: 150   暴击伤害% 
}