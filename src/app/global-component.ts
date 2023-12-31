export const GlobalComponent = {
    // Api Calling
    API_URL : 'http://localhost:3279/api/',
    headerToken : {'Authorization': `${localStorage.getItem('token')}`},

    // Auth Api
    AUTH_API:"http://localhost:3279/api/auth/",
    refreshToken: 'update-token',

    // AIO Api
    AIO_API: "https://myapps.aio.co.id/otsuka-api/api/",

    // Actor Api
    product:'apps/product',
    productDelete:'apps/product/',

    // Orders Api
    order:'apps/order',
    orderId:'apps/order/',

    // Customers Api
    customer:'apps/customer',
   
    // Actor Api
    actor: 'master/actor',
    actorId: 'master/actor/',

    // Film Api
    film: 'master/film',
    filmId: 'master/film/',

    // Upload and File Api
    upload: 'master/image/',
    uploadMultiple: 'master/image/multi/',
    image: 'image/',

    // Activity Api
    activity: 'master/activity',
    activityId: 'master/activity/',

    // Area Api
    area: 'master/area',
    areaId: 'master/area/',

    // Machine Area Api
    machineArea: 'master/machine',
    machineAreaId: 'master/machine/',

    // Task Activity Api
    taskActivity: 'master/task-activity',
    taskActivityId: 'master/task-activity/',

    // Task Api
    task: 'master/task',
    taskId: 'master/task/', // aman

    // Finding Api
    finding: 'master/finding/',
    findingDate: 'master/finding/date/',
    findingNotOk: 'master/finding/not-ok/',
    findingNotOkDate: 'master/finding/not-ok/date/', // note
    findingUnfinished: 'master/finding/undone/',
    findingUnfinishedDate: 'master/finding/undone/date/', // aman
    checklistArea: 'master/checklist/area/', // note
    checklistAreaDate: 'master/checklist/area/date/',
    checklistCategory: 'master/checklist/category/date/', // note

    users: 'master/users/',

    REFRESH_TOKEN_KEY: 'refreshToken',
    TOKEN_KEY: 'token',
    USER_KEY: 'currentUser',

    USER_ENCRYPTION_KEY: 'intern-prodOC3-1',
    ACCESS_TOKEN_ENCRYPTION_KEY: 'intern-prodOC3-2',
    REFRESH_TOKEN_ENCRYPTION_KEY: 'intern-prodOC3-3'
}