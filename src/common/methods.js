export function pathIsDev() {
    let path = window.location.pathname
    if (!path) return false;
    let pArr = path.split('/');
    if (path.indexOf('dev') > -1 && pArr[1] === 'dev') return true
    return false;
}