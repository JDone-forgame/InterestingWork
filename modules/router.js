function route(pathname) {
  console.log(">>>原本路径：" + pathname);
  let newPath = '/undefined';
  switch (pathname) {
    case '/route/submitForm':
      newPath = '/submit/form'
      break;
    default:
      break;
  }
  console.log(">>>新路径：" + newPath);
  return newPath;
}

exports.route = route;