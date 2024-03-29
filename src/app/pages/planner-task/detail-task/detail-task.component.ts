import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { restApiService } from 'src/app/core/services/rest-api.service';
import { Const } from 'src/app/core/static/const';
import { GlobalComponent } from 'src/app/global-component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface ActiveArea {
  area: string;
  area_id: number;
}

@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.scss']
})
export class DetailTaskComponent {
  breadCrumbItems: Array<{}>;
  dateSelected: any
  dateNow: string
  loading: boolean = false

  isAreaSelected: boolean = false
  imageUrl = GlobalComponent.API_URL + GlobalComponent.image
  searchKeyword: string = ''

  columnData = ["#", "Activity / Standard", "Category", "Period", "Machine Area", "Last Updated", "Recommended"]
  activityData: any[] = []
  areaData: any[] = []
  periodData: any[] = []
  categoryData = ['Cleaning', 'Inspecting', 'Lubricating', 'Tightening']
  sortData = ['Activity', 'Category', 'Period', 'Machine Area', 'Last Updated']
  filteredActivityData: any[] = []
  filteredActivityDataBefore: any[] = []

  activeArea: ActiveArea = {
    area: '',
    area_id: -1,
  }

  index: number = 0
  isRecommendedSelected: boolean = false
  isPeriodSelected: boolean = false
  isCategorySelected: boolean = false

  activityIdData: number[] = []
  isSmallScreen: boolean = false
  isThreeDaysChecked: number = 0

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private apiService: restApiService, 
    public common: CommonService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => {
      this.isSmallScreen = result.breakpoints[Breakpoints.XSmall];
    })
    this.breadCrumbItems = [
      { label: 'Planner' },
      { label: 'Tasks' },
      { label: 'Detail', active: true },
    ];
    this.dateNow = common.getTodayDate()
    this.isRecommendedSelected = true
  }

  async ngOnInit() {
    await this.getAreaData().finally(() => this.loading = false)
    await this.getActivityData().finally(() => this.loading = false)
    this.route.params.subscribe(params => {
      this.dateSelected = params['date']
    })
    this.route.queryParams.subscribe((params: any) => {
      if (params.id) {
        this.onAreaClick(+params.id)
      } else {
        this.isAreaSelected = false
      }
    });
    
  }

  async getAreaData() {
    return new Promise((resolve, reject) => {
      this.loading = true
      this.apiService.getAreaData().subscribe({
        next: (res: any) => {
          this.areaData = res.data
          resolve(true)
        },
        error: (err) => {
          reject(err);
        }
      })
    })
  }

  async getActivityData() {
    return new Promise((resolve, reject) => {
      this.loading = true
      this.apiService.getActivityData().subscribe({
        next: (res: any) => {
          this.activityData = res.data
        },
        error: (err) => {
          reject(err);
          this.common.showServerErrorAlert(Const.ERR_GET_MSG("Activity"), err)
        },
        complete: () => {
          resolve(true)
        }
      })
    })
  }

  backToArea() {
    this.isAreaSelected = false
    this.router.navigate([`/planner/tasks/create/${this.dateSelected}`])
  }

  onAreaClick(id: number) {
    this.filteredActivityData = this.activityData.filter(data => data.area_id == id)
    this.filteredActivityData.forEach((data) => {
      data.is_selected = this.isRecommended(this.common.getDayCount(data.last_updated, this.dateSelected), this.common.getPeriodDayCount(data.periode))
    })
    this.filteredActivityDataBefore = this.filteredActivityData.map(a => ({ ...a }));
    this.periodData = this.common.getUniqueData(this.filteredActivityData, 'periode').map(data => {
      return {
        period: data.periode,
        checked: false
      }
    })
    this.isAreaSelected = true
    this.router.navigate([`/planner/tasks/create/${this.dateSelected}`], {
      queryParams: {
        id: id,
      }
    })
    if (this.filteredActivityData.length <= 0) {
      this.common.showErrorAlert("Cannot find area with id: " + id)
    }
    let areaName = this.filteredActivityData.find(item => item.area_id === id)
    if (areaName) {
      const activeArea: ActiveArea = {area: areaName.area, area_id: id}
      this.activeArea = activeArea
    }
  }

  isRecommended(dayDifference: number | null, dayPeriod: number): boolean {
    if (dayDifference != null) {
      return dayDifference >= dayPeriod ? true : false
    }
    else return true
  }

  onActivityCheck(event: any) {
    const id = event.target.value
    const checked = event.target.checked
  }

  onChecklistAll(event: any) {
    this.filteredActivityData.forEach((activity) => {
      event.target.checked ? activity.is_selected = true : activity.is_selected = false
    })
    this.resetPeriodCheckbox()

    this.isCategorySelected = false
    this.isRecommendedSelected = false
    this.isPeriodSelected = false
  }

  onThreeDaysSet(event: any) {
    event.target.checked ? this.isThreeDaysChecked = 1 : this.isThreeDaysChecked = 0
  }

  onCreateTask(areaId: number) {
    const isAllDataNotSelected = this.filteredActivityData.every(activity => activity.is_selected === false)
    if (!isAllDataNotSelected) {
      let filteredData = this.filteredActivityData.filter(item => item.is_selected)
      let period = this.checkPeriodEquality(filteredData)
      let taskData = { area_id: areaId, date: this.dateSelected, is_three_days: this.isThreeDaysChecked, period: period }
      
      this.insertTaskData(taskData).then((taskId) => {
        let activityData: any[] = []
        filteredData.forEach((activity) => {
          activityData.push({
            task_id: taskId,
            activity_id: activity.activity_id
          })
        })
        if (activityData.length > 0) {
          this.insertTaskActivity(activityData)
        }
      })
    }
  }

  insertTaskActivity(activityData: any) {
    this.loading = true
    this.apiService.insertTaskActivity(activityData).subscribe({
      next: (res: any) => {
        this.loading = false
        this.common.showSuccessAlert("Task created successfully")
        this.router.navigate(['/planner/tasks'])
      },
      error: (err) => {
        this.loading = false
        this.common.showErrorAlert(Const.ERR_INSERT_MSG("Activity"), err)
      }
    })
  }

  async insertTaskData(taskData: any) {
    return new Promise((resolve, reject) => {
      this.apiService.insertTaskData(taskData).subscribe({
        next: (res: any) => {
          let taskId = res.data[0]
          resolve(taskId)
        },
        error: (err: any) => {
          reject(err)
          this.common.showErrorAlert(Const.ERR_INSERT_MSG("Task"), err)
        }
      })
    })
  }

  filteredData() {
    return this.filteredActivityData.filter(
      (data) =>
        data.activity
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase()) ||
        data.standard
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase()) ||
        data.periode
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase()) ||
        data.category
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase()) ||
        data.machine_area
          .toLowerCase()
          .includes(this.searchKeyword.trim().toLowerCase())
    );
  }

  resetPeriodCheckbox() {
    this.periodData.forEach(data => {
      data.checked = false;
    })
  }

  onAutoSelectClick(event: any, property?: any) {
    const filterId: string = event.target.id
    
    if (!property) {
      if (filterId == 'btnRecommended') {
        this.isCategorySelected = false
        this.isPeriodSelected = false
        this.filteredActivityData.forEach(data => {
          let dayCount = this.common.getDayCount(data.last_updated, this.dateSelected)
          let periodCount = this.common.getPeriodDayCount(data.periode)
          data.is_selected = this.isRecommended(dayCount, periodCount)
        })
        this.isRecommendedSelected = true
        this.resetPeriodCheckbox()
      }
    } else {
      if (filterId == 'btnCategory') {
        this.isPeriodSelected = false
        this.isRecommendedSelected = false
        this.filteredActivityData.forEach(data => data.is_selected = data.category == `${property}` ? true : false)
        this.isCategorySelected = true
        this.resetPeriodCheckbox()
      } else {
        this.isRecommendedSelected = false
        this.isCategorySelected = false
        property.checked = event.target.checked
        
        this.filteredActivityData.forEach(data => {
          if (!this.isPeriodSelected) {
            data.is_selected = false
          }
          if (data.periode == `${property.period}`) {
            data.is_selected = event.target.checked
          }
        })

        this.isPeriodSelected = true
        // this.filteredActivityData.forEach(data => {
        //   data.is_selected = data.periode == `${property}` ? true : false
        // })
        // this.filteredActivityData.sort((a, b) => {
        //   if (a.is_selected === b.is_selected) {
        //     return 0;
        //   } else if (a.is_selected) {
        //     return -1;
        //   } else {
        //     return 1;
        //   }
        // })
        
      } 
    }
  }

  onSortClick(event: any) {
    if (event.target.value == 'Default') {
      this.filteredActivityData = this.filteredActivityDataBefore
    }

    if (event.target.value == "Activity") {
      let sort = this.filteredData().slice().sort((a, b) => {
        const A = a.activity.toLowerCase()
        const B = b.activity.toLowerCase()

        return A < B ? -1 : A > B ? 1 : 0
      })
      this.filteredActivityData = sort
    }

    if (event.target.value == "Category") {
      let sort = this.filteredData().slice().sort((a, b) => {
        const A = a.category.toLowerCase()
        const B = b.category.toLowerCase()

        return A < B ? -1 : A > B ? 1 : 0
      })
      this.filteredActivityData = sort
    }

    if (event.target.value == "Period") {
      let sort = this.filteredData().slice().sort((a, b) => {
        const A = this.common.getPeriodDayCount(a.periode)
        const B = this.common.getPeriodDayCount(b.periode)

        return A - B
      })
      this.filteredActivityData = sort
    
    }
    if (event.target.value == "Machine Area") {
      let sort = this.filteredData().slice().sort((a, b) => {
        const A = a.machine_area.toLowerCase()
        const B = b.machine_area.toLowerCase()

        return A < B ? -1 : A > B ? 1 : 0
      })
      this.filteredActivityData = sort
    }

    if (event.target.value == "Last Updated") {
      let sort = this.filteredData().slice().sort((a, b) => {
        const A = new Date(a.last_updated)
        const B = new Date(b.last_updated)

        return B.getTime() - A.getTime();
      })
      this.filteredActivityData = sort
    }
  }

  checkPeriodEquality(arr: any[]): string {
    const periods = arr.map(item => item.periode);
    const uniquePeriods = Array.from(new Set(periods));

    if (uniquePeriods.length === 1) {
        return uniquePeriods[0];
    } else {
        return uniquePeriods.join(', ');
    }
}
}
