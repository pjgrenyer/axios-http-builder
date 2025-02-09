// https://stackoverflow.com/questions/69169492/async-external-function-leaves-open-handles-jest-supertest-express
export const preventDanglingOpenHandle = () => process.nextTick(() => {});
