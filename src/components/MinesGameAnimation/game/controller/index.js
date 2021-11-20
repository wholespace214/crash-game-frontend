import { Emitter } from "../../sources/extensions/index.js";
import Engine from "./engine/index.js";

export default class Controller extends Emitter {
  constructor() {
    super();

    this.model = null;
    this.view = null;
  }

  initialize(model, view, handlers) {
    this.model = model;
    this.view = view;
    this.handlers = handlers;
  }

  useConfig({ gameConfig, gameViewConfig }) {
    const initializedMap = Engine.initializeMap(gameConfig);
    this.model.addData(gameConfig, initializedMap);

    const { flagsLeft } = this.model;
    const { timing } = gameConfig;

    this.view.setViewData({
      ...gameViewConfig,
      flags: flagsLeft,
      timing
    });
  }

  setResources(res) {
    this.view.setResources(res);
  }

  resize({ width, height }) {
    const isLandscape = width > height;

    this.view.position.set(width / 2, height / 2);
    //isLandscape=false;
    //this.view.rotation = isLandscape ? -Math.PI / 2 : 0;
    console.log(isLandscape);
    this.view.resize({ width, height });
  }

  update(delta) {
    this.view.update(delta);
  }

  run() {
    const { grid } = this.model;
    this.view.creteGrid(grid);
    this.view.on("flagRequested", this.onFlagRequested, this);
    this.view.on("clickOnCell", this.onClickOnCell, this);
    // this.view.on("overOnCell", this.overOnCell, this);
    // this.view.on("outOnCell", this.outOnCell, this);
    this.view.once("restartGame", this.onRestartGame, this);

    //this.view.createHeader();
    // this.view.createPopup("start", () => {
    //   this.view.resume();
    //   this.view.removePopup();
    // });

    this.view.resume();
    this.view.removePopup();
  }

  onRestartGame() {
    this.view.cleanView();
    this.model.cleanModel();
    this.view.off("flagRequested", this.onFlagRequested, this);
    this.view.off("clickOnCell", this.onClickOnCell, this);
    this.emit("restartGame");
  }

  /** To react on user interactivity and
   * update model and view */
  onFlagRequested({ row, col }) {

    this.model.toggleCellFlag(row, col);

    if (this.model.flagsLeft < 0) {
      this.model.toggleCellFlag(row, col);
    } else {
      this.view.toggleCellFlag(row, col);
      this.view.updateFlagsNumber(this.model.flagsLeft);
    }
  }

  /** To react on user interactivity and use engine to calculate game's data,
   *  update model and view */
  onClickOnCell({ row, col }) {
    const { grid: { collection } } = this.model;

    const gameEngineResult = Engine.checkSelectedCell(collection, row, col);

    const checkCell = this.handlers.checkSelectedCell({row, col}).then((result)=> {

      // console.log('result', result);
      // console.log('result.row', result.row);
      // console.log('result.col', result.col);

      const thisCell = collection[result.row][result.col]
      thisCell.isMine = result.isMine;
      thisCell.isRevealed = result.isRevealed;

      this.view.updateGrid(this);

      const revealArray = [
        thisCell
      ];

      this.model.updateCellsData(revealArray);
      this.view.revealCells(revealArray);

      //reveal all
      // this.view.revealCells(this.model.cellsToRevealed.flat());

      if (thisCell.isMine) {
        this.view.gameOver("lose");
        this.view.revealCells(this.model.allMines.flat());
        console.log('this.model.cellsToRevealed()', this.model.cellsToRevealed.flat());
        // this.view.revealCells(this.model.cellsToRevealed.flat());
        console.log('GAME LOST', revealArray);
      } else if (this.model.isGameWon) {
        console.log('GAME WON', revealArray);
       // this.view.revealCells(result);
        this.view.gameOver("win");
        this.view.flagMines(this.model.totFlaggedCells.flat());
      } else {
        console.log("GAME OTHER", revealArray);
    //    this.view.revealCells(result);
      }

    });
  }
  overOnCell({ row, col }) {
    const { grid: { collection } } = this.model;
    const result = Engine.checkSelectedCell(collection, row, col);
    console.log(row +"---"+col);
    console.log(result);
    //this.model.updateCellsData(result);
     this.view.overCell(result);
    // console.log(result);
  }
  outOnCell({ row, col }) {
    const { grid: { collection } } = this.model;
    const result = Engine.checkSelectedCell(collection, row, col);
    console.log(row +"---"+col);
    console.log(result);
    //this.model.updateCellsData(result);
     this.view.outCell(result);
    // console.log(result);
  }
}
