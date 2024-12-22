import { render } from 'preact';
import App from './app';

// 原始console.log
const stdLog = console.log;

// 安全调用JSON.parse()，无法转换会返回null
const parsedJSON = (data) => {
  try {
    const result = JSON.parse(data);
    if (typeof result !== 'object' || result === null) {
      return null;
    }
    return result;
  } catch (err) {
    return null;
  }
};

const checkIsTDLog = (data) => {
  // 检查最外层对象结构
  if (!(data['data']) || !Array.isArray(data['data'])) {
    return false;
  }
  // 检查data数组结构
  const dataArr = data['data'];
  if (dataArr.some((item) => !(item['#type']) || item['#type'] !== 'track')) {
    return false;
  }
  return true;
};

// 重写console.log
console.log = (...args) => {
  // super()
  stdLog.apply(console, args);
  // 自定义逻辑
  const message = args[0];
  const data = parsedJSON(message);
  if (!data) {
    return;
  }
  const isTDLog = checkIsTDLog(data);
  if (!isTDLog) {
    return;
  }
  window.postMessage({
    type: 'track',
    data: data['data'][0],
  });
};

// 挂载preact组件
const mountApp = () => {
  if (document.getElementById('alice-td-monitor')) return;

  const root = document.createElement('div');
  root.id = 'alice-td-monitor';

  document.body.appendChild(root);
  render(<App />, root);
};
mountApp();