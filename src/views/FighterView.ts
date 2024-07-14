import { FighterController } from "../controllers/FighterController";

export class FighterView {
  static async displayFighter(query: string) {
    const fighter = await FighterController.getFighter(query);
    console.log(fighter);
  }
}
