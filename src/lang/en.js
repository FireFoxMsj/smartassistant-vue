export const global = {
  home: 'home',
  scene: 'scene',
  mine: 'mine',
  loading: 'loading',
  all: 'all',
  save: 'save',
  saving: 'Saving...',
  enter: 'please enter ',
  saveSuccess: 'saved successfully',
  editSuccess: 'edit successfully',
  delSuccess: 'successfully deleted',
  traSuccess: 'Successfully transferred',
  delSuccessChecked: 'The family has been deleted, and the files stored in ZhiTing family cloud disk have been deleted at the same time',
  isDelChecked: 'And the files stored in ZhiTing family cloud disk have been deleted at the same time',
  add: 'add',
  del: 'delete',
  update: 'update',
  opFail: 'operation failed',
  finish: 'finish',
  filter: 'filter',
  confirm: 'confirm',
  weak: 'no network yet',
  retry: 'retry',
  netWorkErr: 'network error',
  noPermission: 'permission denied',
  empty: 'no content',
  reset: 'reset',
  off: 'Off',
  on: 'On',
  linkFail: 'SA connection failed or no permission',
  reconnect: 'Reconnect',
  year: 'Year',
  month: 'Month',
  day: 'Day',
  hour: 'Hour',
  minute: 'Minute',
  tra: 'Transfer owner',
  loadingVerify: 'Crating verify...',
  powerName: 'Switch',
  colorTempName: 'Color temperature',
  brightnessName: 'Brightness',
  uploaderSuccess: 'Uploaded successfully',
}

export const home = {
  btn: 'add smart device',
  empty: 'You don`t have equipment',
  offline: 'offline'
}

export const owner = {
  position: 'family/company',
  pan: 'zhiting pan',
  support: 'support brand',
  platform: 'third-party platform',
  lang: 'language',
  sheetTitle: 'Switch language',
  zh: 'chinese',
  en: 'english',
  powerTitle: 'authority management',
  certificate: 'retrieve user credentials',
  certificateTip: 'the user credential is the key to access the smart center. Please select whether to allow members to retrieve the credential through the cloud.',
  certificateTitle1: 'allow to retrieve',
  certificateDesc1: 'members can connect to the smart center on any mobile phone/tablet',
  certificateTitle2: 'not allowed to retrieve',
  certificateDesc2: 'members cannot connect again after changing their mobile phones/tablets or uninstalling the APP',
  certificateSetTip: 'you can go to the Professional Edition-Home-Smart Center to modify the selected items'
}

export const discover = {
  title: 'Add device',
  scan: 'Scanning',
  tip1: 'Please make sure the smart device is connected to the power source and connected to the local area network',
  tip2: 'When adding a brand for the first time, please enter [I-Support Brand] to add the brand',
  add: 'Add',
  empty: 'Device not found',
  retry: 'Rescan'
}

export const connect = {
  title: 'Device connection',
  connect: 'Device connecting',
  success: 'connection succeeded!',
  fail: 'Connection failed!',
  retry: 'Rescan'
}

export const areadetail = {
  title: 'Family/Company',
  name: 'name',
  area: 'room/area',
  code: 'qr code',
  verify: 'Verification Code',
  role: 'roles',
  quit: 'Leave the family',
  member: 'member',
  man: 'people',
  sheetTitle: 'Family/Company Name',
  quitTitle: 'Are you sure to leave the family?',
  quitContent: 'After logging out, you can’t view and control the family’s room equipment',
  delTitle: 'confirm to delete?',
  delContent: 'After deleting, all devices under the family/company will be automatically unbound',
  roleTitle: 'Choose a role',
  roleTip1: 'Invitation code',
  roleTip2: 'Select a role and generate an invitation code to invite friends to join. The invitation code is valid within 10 minutes',
  invite: 'Generate invitation code',
  empty: 'please enter the family name',
  inviteTip: 'the invitation code has been generated, please invite friends to join',
  timeTip: 'valid within 10 minutes, please scan the code to join',
  saveTip: 'save to album',
  tapTip: 'long press to save to album',
  joinTip: 'invite you to join',
  creat: 'Creat',
  effective: 'The valid time of captcha is 10 minutes'
}

export const locationmanage = {
  title: 'Room/area management',
  edit: 'edit',
  finish: 'finish',
  empty: 'No room available',
  add: 'add room/area',
  sheetTitle: 'Room/area name',
  emptyTip: 'please enter the room name',
  repeatTip: 'duplicate room name'
}

export const locationdevice = {
  title: 'Room/area ',
  del: 'delete',
  name: 'name',
  tip: 'room device',
  sheetTitle: 'Room/area name',
  delTitle: 'Are you sure to delete this room?',
  delContent: 'deleting a room will not delete the equipment in the room',
  emptyTip: 'please enter the room name'
}

export const locationsetting = {
  title: 'Setting',
  add: 'add room/area',
  tip1: 'device name',
  placeholder: 'please enter the device name',
  tip2: 'device location',
  finish: 'finish',
  sheetTitle: 'Room/area name',
  emptyTip: 'please enter the room name',
  repeatTip: 'duplicate room name',
  deviceEmpty: 'please enter the device name',
  success: 'successfully modified'
}

export const login = {
  login: 'login',
  logoTip: 'zhiting account login',
  authTip: 'after logging in, you will access your Zhiting account information',
  phone: 'phone number',
  phonePlaceHolder: 'please enter phone number',
  password: 'password',
  passwordPlaceHolder: 'please enter the password',
  auth: 'authorized login',
  phoneEmptyTip: 'please enter phone number',
  phoneErr: 'incorrect phone number',
  passwordEmptyTip: 'please enter the password',
  register: 'register',
  forget: 'forgot password',
  protocol: 'click OK, the representative has read and agreed to XXXXXX',
  profession: 'professional Edition',
  account: 'username',
  accountPlaceholder: 'please enter user name',
  success: 'login successful',
  authStep1: 'account login',
  authStep2: 'bind',
  authTip2: 'after binding, you will access the device control of your Zhiting account',
  authBindArea: 'bound family',
  authBindPlaceholder: 'please select the family to be bound',
  authVerify: 'verification code',
  authVerifyPlaceholder: 'please enter verification code',
  authTip3: 'the verification code is generated by the family owner to the Zhiting Family Cloud APP-My-Family/Company-Corresponding Family',
  authBind: 'bind',
  authBinded: '(has been bound)',
  welcome: 'welcome to join Zhiting pan',
  agree1_1: 'agree to authorize the following information of Zhiting Home (',
  agree1_2: ') to Zhiting pan',
  panAuth: 'confirm authorization'
}

export const branddetail = {
  title: 'Brand details',
  added: 'added',
  updateAll: 'update all',
  addAll: 'add all',
  version: 'version number:',
  supportTip: 'devices supported by the brand',
  delContent1: 'Are you sure to delete this plugin?',
  delContent2: 'cannot be used after deletion'
}

export const brandsupport = {
  title: 'Support brand',
  addPlugin: 'add plugin',
  searchPlaceholder: 'enter the brand name to search',
  searchTip: 'The following brands of devices can be added. If you need to add other brands, you can click "+" in the upper right corner to add; if the system does not have a corresponding brand plug-in, you can click [Add plug-in] to upload manually',
  sheetName: 'title',
  uploadTitle: 'click upload plugin',
  uploadContent: 'If the system does not have the plug-in, you can upload it manually',
  sure: 'determine',
  added: 'added',
  total: 'total',
  plugin: 'plugin',
  acceptZip: 'Please upload the compressed package in zip format'
}

export const devicedetail = {
  title: 'Device details',
  update: 'Firmware update',
  power: 'Rights Management'
}

export const devicemanage = {
  name: 'device name',
  position: 'device location',
  plugin: 'associated plugin',
  del: 'delete device',
  delTitle: 'are you sure you want to delete the device',
  empty: 'please enter the device name',
  modify: 'successfully modified'
}

export const membermanage = {
  title: 'Member information',
  role: 'roles',
  sheetTitle: 'Choose a role',
  delTitle: 'are you sure to delete this member?',
  modify: 'successfully modified'
}

export const plugindetail = {
  title: 'Plugin details',
  version: 'version number:',
  support: 'devices supported by the brand'
}

export const register = {
  title: 'registered',
  phone: 'phone number',
  phonePlaceHolder: 'please enter phone number',
  password: 'password',
  passwordPlaceHolder: 'please enter a password (6-20 digits, including letters and numbers)',
  verifyCode: 'verification code',
  verifyCodePlaceHolder: 'please enter verification code',
  getVerifyCode: 'get code',
  cutdoown: 'Re-acquire in seconds',
  tipTitle: 'The number is already registered, do you want to log in?',
  login: 'login',
  phoneError: 'please enter 11 digits mobile phone number',
  passwordEmpty: 'please enter the password',
  passwordError: 'password must meet 6-20 digits',
  success: 'authentication is successful'
}

export const roleadd = {
  addTitle: 'Add role',
  editTitle: 'Edit role',
  placeholder: 'please enter the role name',
  label: 'this role can operate:',
  device: 'device',
  advance: 'advanced settings',
  area: 'family/company',
  selectAll: 'select all',
  location: 'room/area',
  role: 'roles',
  scene: 'scene',
  delTitle: 'confirm to delete?',
  delContent: 'after deleting this role, users of this role will be automatically removed from the family',
  roleEerror: 'please check permissions',
  advanceTitle: 'Control/editing device'
}

export const addlist = {
  title: 'Role list'
}

export const third = {
  title: 'Third platform',
  du: 'xiaodu',
  tm: 'tmall elf',
  duTitle: 'Connect to Baidu Xiaodu',
  duconnect: 'after connection, the smart device can be controlled through the voice of Xiaodu smart speaker. For example: "Xiaodu Xiaodu, turn on the light"',
  duStep1: '1. complete the product networking configuration in the Zhiting APP',
  duexplain1: 'complete the device networking configuration according to the guidance in the APP',
  duStep2: '2. The configuration is xiaodu',
  duexplain2: '(if you have already configured Xiaodu, you can skip this step)',
  duexplain3: '① download and install the Xiaodu Speaker APP.',
  duexplain4: '② register or log in to your Baidu account and pair your Xiaodu speakers.',
  duStep3: '3. bind Zhiting account',
  duexplain5: '① click "My" in the navigation bar at the bottom of the homepage of Xiaodu Speaker APP >> "Add Smart Home Appliances" >> search for "Zhiting"',
  duexplain6: '② click login account, enter Zhiting account and password to complete binding',
  duexplain7: '③ after the binding is successful, the Xiaodu Speaker APP will automatically synchronize your device on the Zhiting platform.',
  duStep4: 'how to use a small degree to influence the voice control of Zhiting equipment',
  duexplain8: '1. modify the device name, group, and connection type on the Xiaodu APP',
  duexplain9: 'make sure to use Chinese to describe the device name, special characters and Martian text are not allowed.',
  duexplain10: 'examples of correct equipment naming: living room lights, hallway sockets, bedroom switches...',
  duexplain11: '2. use Xiaodu speakers to control the device with voice',
  duexplain12: 'use the wake-up word "Xiaodu Xiaodu" to wake up the Xiaodu speaker. At this time, you can see the blue logo aperture on the speaker, and then say the voice command of "open/close + device name";',
  duexplain13: 'for example: "Xiaodu Xiaodu, turn on the living room light"'
}

export const user = {
  title: 'Personal information',
  picture: 'avatar',
  nickname: 'nickname',
  empty: 'please enter a nickname',
  lessErr: 'nickname cannot be less than 6 digits',
  moreErr: 'nickname cannot be greater than 20 digits'
}

export const scene = {
  manual: 'Manual',
  automatic: 'Automatic',
  operation: 'Execute',
  noScene: 'No scene',
  addScene: 'Click Add scene',
  howCreatTitle: 'How to create a scene',
  howCreatCon: 'Let\'s get started with smart scenes',
  deleted: 'Deleted',
  offLine: 'Off-line',
  effictiveTimeTitle: 'Effective time',
  conditionTitle: 'Controlling device'
}

export const creatScene = {
  title: 'Creating scenes',
  title2: 'Modify the scene',
  finish: 'Finish',
  placeholder: 'Scene name',
  addCondition: 'Add trigger condition',
  addTask: 'Add execution task',
  headerTitle1: 'If',
  headerTitle2: 'Just do it',
  conditionTitle: 'Add trigger condition',
  conditionItemTitle1: 'Manual execution',
  conditionItemCon1: 'Click to execute',
  conditionItemTitle2: 'Timing',
  conditionItemCon2: 'For example, 8:00 every day',
  conditionItemTitle3: 'When the equipment status changes',
  conditionItemCon3: 'For example, when you turn on the light, when you feel a person',
  taskTitle: 'Add execution task',
  taskItemTitle1: 'Smart devices',
  taskItemCon1: 'Such as lights, music',
  taskItemTitle2: 'Control scene',
  taskItemCon2: 'Such as opening the scene of summer party',
  relationTitle: 'Please select a multi conditional relationship',
  relationItemTitle1: 'All conditions are met',
  relationItemTitle2: 'Satisfy any condition',
  controlTitle: 'Control scene',
  controlItemTitle1: 'Execute a scene',
  controlItemTitle2: 'Turn on automatic execution',
  controlItemTitle3: 'Turn off automatic execution',
  manualClick: 'Click execute manually',
  delTip: 'whether to delete the scene',
  allDay: 'all day',
  quitTip: 'modifications will be lost after exit, whether to exit',
  crrayOut: 'carried out',
  modifySuccess: 'successfully modified',
  addSuccess: 'created successfully',
  deviceDel: 'device has been deleted',
  sceneDel: 'scene has been deleted',
  noSceneName: 'The scene name has not been set yet',
  noAddCondition: 'Trigger condition not added',
  noAddTask: 'Execution task not added'
}

export const sceneLog = {
  title: 'Execution log',
  empty: 'No logs',
  deviceDelete: 'Device removed',
  deviceBroken: 'Device offline',
  sceneDelete: 'Scene deleted',
  executeTimeout: 'Execution timeout',
  executeSuccess: 'Successful implementation',
  executePartialSuccess: 'Partial execution successful'
}

export const sceneGuide = {
  title: 'How to create a scene',
  stepTitle1: 'Create step',
  step1: '1.Add device',
  explain1: 'Before creating a smart scene, make sure your home has added devices',
  step2: '2.Create scene',
  explain2: '① Click "Scene" in the navigation bar below zhiting app → click "+" to enter the scene arrangement',
  explain3: '② Fill in the scene name. For example: going to the cinema',
  explain4: '③ Click "add trigger condition", select trigger type and set trigger condition. For example: "when the equipment status changes" → "bedroom lamp" → "switch on" → "next", the triggering conditions are added',
  explain5: '④ Click "add execution task", select task type and set execution event. For example: "smart device" → "bedroom lamp" → "Brightness" → "next step", complete the task of adding',
  explain6: '⑤ Click finish in the upper right corner to complete the scene creation',
  stepTitle2: 'How to play smart scenes',
  patternTitle1: 'Wake up mode',
  explain7: 'The curtain will be opened automatically, the smart speaker will play wake-up music, the toaster will be turned on, and the rice cooker will be turned on.',
  patternTitle2: 'Office mode',
  explain8: 'Personalized access control system and automatic adjustment of lighting atmosphere and other intelligent functions create a unique office environment for employees.',
  create: 'o create the scene'
}

export const credentialsGuide = {
  title: 'how to set up to retrieve user credentials',
  tip: '"The current terminal has no credential" is because you have changed your mobile phone/tablet to log in or uninstalled the APP to verify the credential for the safety of your family information. Family owners can use the following path to set up and retrieve user credentials:',
  stepTitle1: '1. Log in to the professional version to enter the details of the smart center',
  stepTitle2: '2. Select Authority Management-Retrieve User Credentials',
  stepTitle3: '3. Change selection and save'
}

export const effectiveTime = {
  allDay: 'all day',
  period: 'period',
  start: 'start',
  end: 'start',
  repeat: 'repeat',
  everyDay: 'every day',
  week: 'monday to friday',
  customize: 'customize',
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
  sunday: 'sunday',
  hour: 'H',
  minute: 'M',
  second: 'S',
  timeErr: 'the start time cannot be greater than the end time'
}

export const condition = {
  switch: 'switch',
  brightness: 'brightness',
  temperature: 'temperature',
  hue: 'hue',
  saturation: 'saturation',
  rgb: 'rgb',
  delay: 'delay',
  turnOn: 'turn on',
  shutDown: 'shut down',
  change: 'switch',
  less: 'less than',
  equal: 'equal',
  more: 'more than',
  next: 'next step',
  leftButton: 'left button',
  middleButton: 'middle button',
  rightButton: 'right button',
  rear: 'rear',
  curtainTitle: 'curtain state',
  curtainState: 'open state',
  curtainOpen: 'open the curtains',
  curtainClose: 'close the curtains',
  curtianPercent: 'percentage of curtains opened'
}

export const transferOwner = {
  title: 'Transfer owner',
  tips: 'The family owner has the highest authority of the family and can delete the family. You can transfer the role to the member. After the transfer, your role will be changed to manager.',
  headerText: 'Select a member to transfer the owner role to him：'
}

export const deviceAttr = {
  power: 'power',
  templature: 'templature',
  brightness: 'brightness',
  hue: 'hue',
  saturation: 'saturation',
  rgb: 'rgb'
}
