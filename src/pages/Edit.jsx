import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import Editor from "../components/Editor";
import { DiaryDispatchContext, DiaryStateContext } from "../App";
import { useContext, useEffect, useState } from "react";
import useDairy from "../hooks/useDiary";
import usePageTitle from "../hooks/usePageTitle";
const Edit = () => {
  const params = useParams();
  const { onDelete, onUpdate } = useContext(DiaryDispatchContext);
  const nav = useNavigate();
  const curDiaryItem = useDairy(params.id);
  usePageTitle(`${params.id}번 일기 수정`);
  // const data = useContext(DiaryStateContext);

  // const [curDiaryItem, setcurDiaryItem] = useState();
  // useEffect(() => {
  //   const currentDiaryItem = data.find(
  //     (item) => String(item.id) === String(params.id)
  //   );
  //   if (!currentDiaryItem) {
  //     alert("존재하지 않는 일기입니다.");
  //     nav("/", { replace: true });
  //   }
  //   setcurDiaryItem(currentDiaryItem);
  // }, [params.id]);
  const onClickDelete = () => {
    if (confirm("일기를 정말 삭제할까요? 다시 복구되지 않아요!")) {
      onDelete(params.id);
      nav("/", { replace: true }); // 홈으로 이동, 뒤로가기 방지
    }
  };
  const onSubmit = (input) => {
    if (confirm("일기를 정말 수정할까요?")) {
      onUpdate(
        params.id,
        input.createdDate.getTime(),
        input.emotionId,
        input.content
      );
      nav("/", { replace: true });
    }
  };
  return (
    <div>
      <Header
        title={"일기 수정하기"}
        leftChild={
          <Button
            text={"< 뒤로 가기"}
            onClick={() => {
              nav(-1);
            }}
          />
        }
        rightChild={
          <Button onClick={onClickDelete} text={"삭제하기"} type={"NEGATIVE"} />
        }
      />
      <Editor initData={curDiaryItem} onSubmit={onSubmit} />
    </div>
  );
};
export default Edit;
