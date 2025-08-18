import {
    LayoutComponentDetailBuilder,
    SerializableAction,
    ActionBuilder,
    Actions,
    ChainBuilder,
    ConditionBuilder,
    Conditions,
    EventBindings,
    EventBindingsBuilder
} from 'xingine';
import { CommissarOptions } from 'xingine-nest';
import {UserLoginDto} from "@/dto/user.dto";

const chartWrapperClass = `w-full h-[300px] bg-white p-4 shadow rounded`;

const chartComponent = LayoutComponentDetailBuilder.create()
  .chart()
  .charts([
    {
      type: 'bar',
      height: 300,
      width: 300,
      title: 'Sales Performance',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Sales',
          data: [4000, 3000, 2000, 2780, 1890, 2390],
          backgroundColor: '#1890ff',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
    {
      type: 'line',
      title: 'User Growth',
      height: 300,
      width: 300,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Users',
          data: [240, 221, 229, 200, 218, 250],
          borderColor: '#52c41a',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
    {
      type: 'pie',
      title: 'Device Distribution',
      height: 300,
      width: 300,
      datasets: [
        {
          label: 'Devices',
          data: [400, 300, 300, 200],
          backgroundColor: '#1890ff',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
      labels: ['Desktop', 'Mobile', 'Tablet', 'Other'],
    },
    {
      type: 'scatter',
      title: 'Revenue Analysis',
      height: 300,
      width: 300,
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Revenue',
          data: [
            { x: 1, y: 2400 },
            { x: 2, y: 1398 },
            { x: 3, y: 9800 },
            { x: 4, y: 3908 },
          ],
          backgroundColor: '#722ed1',
        },
      ],
      style: {
        className: chartWrapperClass,
      },
    },
  ])
  .build();
export const userAnalytics: CommissarOptions = {
  component: chartComponent,
};

/*export const addRole: CommissarProperties = {
  directive: CreateRoleDto,
  operative: 'FormRenderer',
  component: 'AddRole',
};
export const userDetail: CommissarProperties = {
  directive: UserDetailDto,
  operative: 'DetailRenderer',
  component: 'UserDetail',
};
export const userList: CommissarProperties = {
  directive: UserList,
  operative: 'TableRenderer',
  component: 'UserList',
};

export const createUser: CommissarProperties = {
  directive: UserCreateDto,
  /!*dispatch: {
    formSubmissionResponse: {},
    onSuccessRedirectTo: {
      component: 'UserDetail',
      payloadNamePath: { username: 'user.username' },
    },
  },*!/
  operative: 'FormRenderer',
  component: 'UserCreate',
};*/

const submitAction: SerializableAction = ActionBuilder
    .create('makeApiCall')
    .withArgs({
      url: '/api/users/users/login',
      method: 'POST',
    })
    .withChains(
        // SUCCESS CASE - Single condition, action with mapped sequence
        ChainBuilder
            .create()
            .whenCondition(Conditions.onLoginSuccess())
            .thenActionBuilder(
                Actions.setStorage('authToken', '#{__result.user.token}')
                    .then(
                        Actions.setStorage('userEmail', '__result.user.email').build(),
                        Actions.setStorage('username', '__result.user.username').build(),
                        Actions.setStorage('userBio', '__result.user.bio').build(),
                        Actions.setStorage('userImage', '__result.user.image').build(),
                        Actions.setState('isAuthenticated', true).build(),
                        Actions.setState('user', '__result.user').build(),
                        Actions.showToast('Login successful! Welcome back.', 'success').build(),
                        Actions.navigate('/home').build()
                    )
            )
            .build(),

        // VALIDATION ERROR CASE
        ChainBuilder
            .create()
            .whenCondition(Conditions.onValidationError())
            .thenActionBuilder(
                Actions.showToast('Please check your email format and try again.', 'error')
                    .then(
                        Actions.setState('validationErrors', '__result.errors').build()
                    )
            )
            .build(),

        // LOGIN FAILURE CASE
        ChainBuilder
            .create()
            .whenCondition(
                ConditionBuilder.and(
                    ConditionBuilder.field('__result.errors.User').isNotNull().build(),
                    ConditionBuilder.field('__result.user').isNull().build()
                )
            )
            .thenActionBuilder(
                Actions.showToast('Invalid credentials. Please check your email and password.', 'error')
                    .then(
                        Actions.setState('loginError', '__result.errors').build()
                    )
            )
            .build(),

        // GENERIC ERROR FALLBACK
        ChainBuilder
            .create()
            .whenCondition(
                ConditionBuilder.and(
                    ConditionBuilder.field('__result.user').isNull().build(),
                    ConditionBuilder.field('__result.message').notEquals('Input data validation failed').build(),
                    ConditionBuilder.field('__result.errors.User').isNull().build()
                )
            )
            .thenAction('showToast', {
              message: 'Login failed. Please try again later.',
              type: 'error'
            })
            .build()
    )
    .build();


const submitEvent:EventBindings = EventBindingsBuilder.create()
    .onSubmit(submitAction)
    .build();


const formComponent = LayoutComponentDetailBuilder.create()
  .form()
  .fromClass(UserLoginDto)
    .withEventBindings(submitEvent)
  .build();

export const userLogin: CommissarOptions = {
  component: formComponent,
  path: {
    overrideLayout: 'login',
  },
};
