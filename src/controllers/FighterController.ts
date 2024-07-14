import { FighterModel } from '../models/FighterModel';

export class FighterController {
    static async getFighter(query: string) {
        const sherdogLink = await FighterModel.getSherdogLink(query);
        const ufcLink = await FighterModel.getUfcLink(query);

        const fighter = await FighterModel.parseSherdogFighter(sherdogLink);
        const ufcStats = await FighterModel.getUfcStats(ufcLink);

        return { ...fighter, ...ufcStats };
    }
}
