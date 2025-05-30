import { useContext, useState, useEffect } from "react";
import { DiaryStateContext } from "../App";
import { useNavigate } from "react-router-dom";

const useDairy = (id) => {
  const data = useContext(DiaryStateContext);
  const [curDiaryItem, setcurDiaryItem] = useState();
  const nav = useNavigate();
  useEffect(() => {
    const currentDiaryItem = data.find(
      (item) => String(item.id) === String(id)
    );
    if (!currentDiaryItem) {
      alert("존재하지 않는 일기입니다.");
      nav("/", { replace: true });
    }
    setcurDiaryItem(currentDiaryItem);
  }, [id]);
  return curDiaryItem;
};

export default useDairy;
