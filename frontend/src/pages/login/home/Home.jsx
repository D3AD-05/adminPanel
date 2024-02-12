import React from "react";
import "./home.scss";
import { ChartBox } from "../../../components";

function Home() {
  return (
    <div className="home">
      <div className="box box1">
        <ChartBox icon="order.svg" title="Total Orders" value="50" />
      </div>
      <div className="box box2">
        <ChartBox icon="order.svg" title="Total Gross" value="50" />
      </div>
      <div className="box box3">
        <ChartBox icon="stone.svg" title="Total Stone" value="50" />
      </div>
      <div className="box box4">4</div>
      <div className="box box5">
        <ChartBox icon="diamond.svg" title="Total Diamonds" value="50" />
      </div>
      <div className="box box7">
        <ChartBox icon="order.svg" title="Total Net" value="50" />
      </div>
      <div className="box box6">
        <ChartBox icon="user.svg" title="Total No of Users" value="50" />
      </div>
      <div className="box box8">8</div>
      <div className="box box9"></div>
    </div>
  );
}

export default Home;
