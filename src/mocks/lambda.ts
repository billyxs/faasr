export default function lambdaMock(params) {
  return {
    invoke(params = {}) {
      return {
        promise() {
          return new Promise((resolve, reject) => {
            setTimeout(() => resolve(true), 1000)
          })
        },
        error() {
          return new Promise((resolve, reject) => {
            setTimeout(() => reject(true), 1000)
          })
        }
      } 
    }
  }
}
