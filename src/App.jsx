import "./App.css";
import {
  useReducer,
  useRef,
  createContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import Diary from "./pages/Diary";
import New from "./pages/New";
import Home from "./pages/Home";
import Edit from "./pages/Edit.jsx";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import Notfound from "./pages/Notfound";
import { getEmotionImage } from "./util/get-emotion-image.js";
import Button from "./components/Button.jsx";
import Header from "./components/Header.jsx";

// const mockData = [
//   {
//     id: 1,
//     createdDate: new Date("2025-05-21").getTime(),
//     emotionId: 1,
//     content: "1번 일기 내용",
//   },
//   {
//     id: 2,
//     createdDate: new Date("2025-05-20").getTime(),
//     emotionId: 2,
//     content: "2번 일기 내용",
//   },
//   {
//     id: 3,
//     createdDate: new Date("2025-04-04").getTime(),
//     emotionId: 3,
//     content: "3번 일기 내용",
//   },
// ];

// function reducer(state, action) {
//   switch (action.type) {
//     case "CREATE":
//       return [action.data, ...state];
//     case "UPDATE":
//       return state.map((item) =>
//         String(item.id) === String(action.data.id) ? action.data : item
//       );
//     case "DELETE":
//       return state.filter((item) => String(item.id) !== String(action.data.id));
//     default:
//       return state;
//   }
// }

function reducer(state, action) {
  let nextState;
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      nextState = [action.data, ...state];
      break;
    }
    case "UPDATE": {
      nextState = state.map((item) =>
        String(item.id) === String(action.data.id) ? action.data : item
      );
      break;
    }
    case "DELETE": {
      nextState = state.filter(
        (item) => String(item.id) !== String(action.data.id)
      );
      break;
    }
    default:
      nextState = state;
      break;
  }
  localStorage.setItem("diary", JSON.stringify(nextState));
  return nextState;
}

export const DiaryStateContext = createContext();
export const DiaryDispatchContext = createContext();

function App() {
  // useEffect 에서 데이터가 없는데 컴포넌트 호출이 먼저 되어
  // 없는 데이터로인한 에러를 방지하기 위해 데이터가 없을땐 loading이 true, 들어오면 false로
  //  변경해주어 true일때는 로딩화면을 보여줌,
  // 선언형 프로그래밍이기에 상태가 바뀌면 다시 렌더링해주기에
  // loading 상태가 변경될때 없는 데이터로 에러가 나던 컴포넌트를 호출하도록 이처럼 설정해줘야함.

  const [isLoading, setIsLoading] = useState(true);

  const [data, dispatch] = useReducer(reducer, []);
  const idRef = useRef(0);

  useEffect(() => {
    const storedData = localStorage.getItem("diary");
    if (!storedData) {
      setIsLoading(false);
      return;
    }
    const parsedData = JSON.parse(storedData);
    if (!Array.isArray(parsedData)) {
      setIsLoading(false);
      return;
    }
    let maxId = 0;

    parsedData.forEach((item) => {
      if (Number(item.id) > maxId) {
        maxId = Number(item.id);
      }
    });
    idRef.current = maxId + 1;
    dispatch({
      type: "INIT",
      data: parsedData,
    });
    setIsLoading(false);
    console.log(maxId);
  }, []);

  const onCreate = (createdDate, emotionId, content) => {
    //새 일기 추가하는 기능
    dispatch({
      type: "CREATE",
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  const onUpdate = (id, createdDate, emotionId, content) => {
    // 기존 일기 수정
    dispatch({
      type: "UPDATE",
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  const onDelete = (id) => {
    // 기존 일기 삭제
    dispatch({
      type: "DELETE",
      data: {
        id,
      },
    });
  };
  if (isLoading) {
    return <div>데이터 로딩중 입니다...</div>;
  }

  return (
    <>
      {/* <Header
        title={"header"}
        leftChild={<Button text={"Left"} />}
        rightChild={<Button text={"Right"} />}
      /> */}
      {/* <button
        onClick={() => {
          onCreate(new Date().getTime(), 1, "HELLO");
        }}
      >
        일기 추가 테스트
      </button>
      <button
        onClick={() => {
          onUpdate(1, new Date().getTime(), 4, "HELLO수정");
        }}
      >
        일기 수정 테스트
      </button>
      <button
        onClick={() => {
          onDelete(1);
        }}
      >
        일기 삭제 테스트
      </button> */}

      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onDelete, onUpdate }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<New />} />
            <Route path="/diary/:id" element={<Diary />} />
            <Route path="/Edit/:id" element={<Edit />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>

      {/* <Button
        text={2}
        type={"POSITIVE"}
        onClick={() => {
          console.log(123);
        }}
      /> */}
    </>
  );
}

export default App;

// 1. "/" : 모든 일기를 조회하는 Home 페이지
// 2. "/new" : 새로운 일기를 작성하는 New 페이지
// 3. "/diary" : 일기를 상세히 조회하는 Diary 페이지

// 페이지 이동 방법으론
// 1. useNavigate("어디로?")로 이벤트 발생시키면 됨
// 2. react rount dom의 Link를 이용

/* <img src={"./emotion1.png"} /> */
// <div>
//   <img src={getEmotionImage(1)} />
//   <img src={getEmotionImage(2)} />
//   <img src={getEmotionImage(3)} />
//   <img src={getEmotionImage(4)} />
//   <img src={getEmotionImage(5)} />
// </div>
// <div>
//   <h1>Routes 태그 밖의 태그들은 공통으로 보여짐</h1>
//   <a href="/">Home a</a>
//   <Link to={"/"}>Home</Link>
//   <Link to={"/new"}>New</Link>
//   <Link to={"/diary"}>Diary</Link>
//   <button onClick={onClickButton}>New 페이지로 이동</button>
// </div>
