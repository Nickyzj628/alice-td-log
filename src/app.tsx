import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Recordable } from './content';

const App = () => {
  const tableBoxRef = useRef<HTMLDivElement>(null);
  const [isTableVisible, setisTableVisible] = useState(false);

  const [values, setValues] = useState<Recordable[]>([]);
  const keys = useMemo(() => {
    return Object.keys(values?.[0] ?? []);
  }, [values]);

  const renderValue = useCallback((value: any) => {
    if (typeof value !== 'object') {
      return value || '-';
    }
    return Object.entries(value).map(([key, value]) => (
      <code
        key={key}
        style={{
          display: 'block',
          marginBottom: 4,
          wordBreak: 'break-all',
        }}
      >
        {`${key}: ${renderValue(value)}`}
      </code>
    ));
  }, []);

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
        tableBox.scrollTo(0, tableBox.scrollHeight - tableBox.clientHeight);
      }, 0);
    });
  }, []);

  return (
    <>
      {
        isTableVisible && (
          <div
            ref={tableBoxRef}
            style={{
              flex: 1,
              maxWidth: '100%',
              overflow: 'auto',
            }}
          >
            <table
              style={{
                backgroundColor: 'white',
              }}
            >
              <thead
                style={{
                  position: 'sticky',
                  top: 0,
                  backgroundColor: 'white',
                }}
              >
                <tr>
                  {
                    keys.map((key) => (
                      <th
                        key={key}
                        style={{
                          border: '1px solid black',
                          paddingInline: 16,
                          paddingBlock: 8,
                          textAlign: 'left',
                        }}
                      >
                        {key}
                      </th>
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
                          <td
                            key={key}
                            style={{
                              border: '1px solid black',
                              paddingInline: 16,
                              paddingBlock: 8,
                            }}
                          >
                            <span
                              style={{
                                display: 'block',
                                maxHeight: 200,
                                overflowY: 'auto',
                              }}
                            >
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
      <button
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          padding: 0,
          borderRadius: '50%',
          overflow: 'hidden',
        }}
        onClick={() => setisTableVisible(!isTableVisible)}
      >
        <img
          src='https://shushu.ksztone.com/oauth/ta/favicon.ico'
          alt=''
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </button>
    </>
  );
};

export default App;