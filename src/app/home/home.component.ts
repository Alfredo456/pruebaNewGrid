import {
  Component,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";
import {
  IgxGridComponent,
  IgxNumberSummaryOperand,
  IgxStringFilteringOperand,
  IgxSummaryResult
} from "igniteui-angular";
import { ProcessService } from './process.service';
//import { athletesData } from "./../services/data";
//import { DataService } from "./../services/data.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild("grid1", { read: IgxGridComponent, static: true })
  public grid1: IgxGridComponent;

  public localData: any[];
  public localDataPrueba: any[];
  public isFinished = false;
  private _live = true;
  private _timer;
  private windowWidth: any;
  public lData: any[];
  public lData2: any[];

  public contextmenu = false;
  public contextmenuX = 0;
  public contextmenuY = 0;
  public clickedCell = null;
  public copiedData;
  public multiCellSelection: { data: any[] } = { data: [] };
  public multiCellArgs;
  cell: any;
  onCellValueCopy: any;
  selectedCells: any;

  get live() {
    return this._live;
  }

  set live(val) {
    this._live = val;
    if (this._live) {
      this._timer = setInterval(() => this.ticker(), 3000);
    } else {
      clearInterval(this._timer);
    }
  }

  get hideAthleteNumber() {
    return this.windowWidth && this.windowWidth < 960;
  }
  get hideBeatsPerMinute() {
    return this.windowWidth && this.windowWidth < 860;
  }

  constructor(private zone: NgZone, private processService: ProcessService) { }

  public ngOnInit() {
    this.processService.getTask().subscribe(x => {
      console.log('alfredo x', x);
      this.localDataPrueba = x.data;
    });
    const athletes = [];
    // this.localDataPrueba = [{
    //   estado: 'APROBADO',
    //   tarea: 'M1'
    // },
    // {
    //   estado: 'RECHAZADO',
    //   tarea: 'M2'
    // }, {
    //   estado: 'APROBADO',
    //   tarea: 'M3'
    // },
    // {
    //   estado: 'RECHAZADO',
    //   tarea: 'M4'
    // }, {
    //   estado: 'NEXT',
    //   tarea: 'M5'
    // }, {
    //   estado: 'APROBADO',
    //   tarea: 'M6'
    // }, {
    //   estado: 'APROBADO',
    //   tarea: 'M7'
    // }];

    for (const athlete of athletes) {
      this.getSpeed(athlete);
    }

    this.localData = athletes;
    this.windowWidth = window.innerWidth;
    this._timer = setInterval(() => this.ticker(), 3000);
  }

  public ngOnDestroy() {
    clearInterval(this._timer);
  }

  public isTop3(cell): boolean {
    const top = cell.value > 0 && cell.value < 4;
    if (top) {
      cell.row.nativeElement.classList.add("top3");
    } else {
      cell.row.nativeElement.classList.remove("top3");
    }
    return top;
  }

  public cellSelection(evt) {
    const cell = evt.cell;
    this.grid1.selectRows([cell.row.rowID], true);
  }

  public getIconType(cell) {
    switch (cell.row.rowData.Position) {
      case "up":
        return "arrow_upward";
      case "current":
        return "arrow_forward";
      case "down":
        return "arrow_downward";
    }
  }

  public getBadgeType(cell) {
    switch (cell.row.rowData.Position) {
      case "up":
        return "success";
      case "current":
        return "warning";
      case "down":
        return "error";
    }
  }

  public getSpeed(athlete: any): any {
    athlete["Speed"] = this.getSpeedeData(40);
  }

  public getSpeedeData(minutes?: number): any[] {
    if (minutes === undefined) {
      minutes = 20;
    }
    const speed: any[] = [];
    for (let m = 0; m < minutes; m += 3) {
      const value = this.getRandomNumber(17, 20);
      speed.push({ Speed: value, Minute: m });
    }
    return speed;
  }

  public getRandomNumber(min: number, max: number): number {
    return Math.round(min + Math.random() * (max - min));
  }

  @HostListener("window:resize", ["$event"])
  public onResize(event) {
    this.windowWidth = event.target.innerWidth;
  }

  public filter(term) {
    this.grid1.filter("tarea", term, IgxStringFilteringOperand.instance().condition("contains"));
    this.grid1.markForCheck();
  }

  private ticker() {
    // this.zone.runOutsideAngular(() => {
    //   this.updateData();
    //   this.zone.run(() => this.grid1.markForCheck());
    // });
  }

  private generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private updateData() {
    this.localData.map((rec) => {
      let val = this.generateRandomNumber(-1, 1);
      switch (val) {
        case -1:
          val = 0;
          break;
        case 0:
          val = 1;
          break;
        case 1:
          val = 3;
          break;
      }

      rec.TrackProgress += val;
    });
    const unsortedData = this.localData.slice(0);

    this.localData.sort((a, b) => b.TrackProgress - a.TrackProgress).map((rec, idx) => rec.Id = idx + 1);
    this.localData = this.localData.slice(0);

    // tslint:disable-next-line:prefer-for-of
    // Browser compatibility: for-of, No support for IE
    for (let i = 0; i < unsortedData.length; i++) {
      this.localData.some((elem, ind) => {
        if (unsortedData[i].Id === elem.Id) {
          const position = i - ind;

          if (position < 0) {
            elem.Position = "down";
          } else if (position === 0) {
            elem.Position = "current";
          } else {
            elem.Position = "up";
          }

          return true;
        }
      });
    }
    console.log('alfredo this.localData', this.localData);
    if (this.localData && this.localData.length > 0 && this.localData[0].TrackProgress >= 100) {
      this.live = false;
      this.isFinished = true;
    }
  }

  public rightClick(eventArgs: any) {
    eventArgs.event.preventDefault();
    this.multiCellArgs = {};
    if (this.multiCellSelection) {
      const node = eventArgs.cell.selectionNode;
      const isCellWithinRange = this.grid1.getSelectedRanges().some((range) => {
        if (node.column >= range.columnStart &&
          node.column <= range.columnEnd &&
          node.row >= range.rowStart &&
          node.row <= range.rowEnd) {
          return true;
        }
        return false;
      });
      if (isCellWithinRange) {
        this.multiCellArgs = { data: this.multiCellSelection.data };
      }
    }
    this.contextmenuX = eventArgs.event.clientX;
    this.contextmenuY = eventArgs.event.clientY;
    this.clickedCell = eventArgs.cell;
    this.contextmenu = true;
  }

  public copySelectedCellData(event) {
    const selectedData = { [this.cell.column.field]: this.cell.value };
    this.copyData(JSON.stringify({ [this.cell.column.field]: this.cell.value }));
    this.onCellValueCopy.emit({ data: selectedData });
  }
  public copy(event) {
    this.copiedData = JSON.stringify(event.data, null, 2);
    if (this.multiCellSelection) {
      this.multiCellSelection = undefined;
      this.multiCellArgs = undefined;
      this.grid1.clearCellSelection();
    }
  }

  public copyRowData(event) {
    const selectedData = this.cell.row.rowData;
    this.copyData(JSON.stringify(this.cell.row.rowData));
    this.onCellValueCopy.emit({ data: selectedData });
  }
  copyData(arg0: string) {
    throw new Error("Method not implemented.");
  }

  public disableContextMenu() {
    if (this.contextmenu) {
      this.multiCellSelection = undefined;
      this.multiCellArgs = undefined;
      this.contextmenu = false;
    }
  }

  public copySelectedCells(event) {
    const selectedData = this.selectedCells.data;
    this.copyData(JSON.stringify(selectedData));
    this.onCellValueCopy.emit({ data: selectedData });
  }

  public onDialogOKSelected(event) {
    event.dialog.close();
  }

  public signIn(event) {
    event.dialog.close();
  }

  public activeSelect() {
    this.processService.getResourceinstances().subscribe(x => {
      console.log('alfredo x getResourceinstances', x);
      this.lData = x.data;
    });
  }
  
  public activeSelect2() {
    this.processService.getForms().subscribe(x => {
      console.log('alfredo x getResourceinstances', x);
      this.lData2 = x.data;
    });
  }
}
