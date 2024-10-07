import { ActionBar } from "@repo/ui/shell/action-bar";
import { HeaderBar } from "@repo/ui/shell/header-bar";
import { Main } from "@repo/ui/shell/main";

export default function Home() {
  return (
    <div>
      <ActionBar></ActionBar>
      <HeaderBar></HeaderBar>
      <Main>Swolo</Main>
    </div>
  );
}
