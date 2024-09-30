// this helper is to determinate if the  current page is activated or not 
function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? 'active' : '';
}

module.exports = { isActiveRoute };
