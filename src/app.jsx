import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';

const App = () => {
  const tableBoxRef = useRef(null);
  const [isTableVisible, setisTableVisible] = useState(Boolean(localStorage.getItem('td_log')));

  const [values, setValues] = useState([]);
  const keys = useMemo(() => {
    return Object.keys(values?.[0] ?? []);
  }, [values]);

  const renderValue = useCallback((value) => {
    if (typeof value !== 'object') {
      return value || '-';
    }
    return Object.entries(value).map(([key, value]) => (
      <code key={key}>
        {`${key}: ${renderValue(value)}`}
      </code>
    ));
  }, []);

  const onClickTrigger = () => {
    const next = !isTableVisible;
    setisTableVisible(next);
    if (next) {
      localStorage.setItem('td_log', '1');
      location.reload();
    } else {
      localStorage.removeItem('td_log');
    }
  };

  // 接收content.js发来的消息
  useEffect(() => {
    window.addEventListener('message', (e) => {
      const { type, data } = e.data;
      if (type !== 'track') {
        return;
      }
      setValues((prev) => [...prev, data]);
      setTimeout(() => {
        const tableBox = tableBoxRef.current;
        if (!tableBox) {
          return;
        }
        tableBox.scrollBy(0, tableBox.scrollHeight - tableBox.clientHeight)
      }, 0);
    });
  }, []);

  return (
    <>
      {
        isTableVisible && (
          <div ref={tableBoxRef} id='alice-td-table'>
            <table>
              <thead>
                <tr>
                  {
                    keys.map((key) => (
                      <th key={key}>{key}</th>
                    ))
                  }
                </tr>
              </thead>
              <tbody>
                {
                  values.map((value, index) => (
                    <tr key={index}>
                      {
                        keys.map((key) => (
                          <td key={key}>
                            <span>
                              {renderValue(value[key])}
                            </span>
                          </td>
                        ))
                      }
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div >
        )
      }
      <button id='alice-td-trigger' onClick={onClickTrigger}>
        <img src='https://shushu.ksztone.com/oauth/ta/favicon.ico' alt='' />
      </button>
    </>
  );
};

export default App;