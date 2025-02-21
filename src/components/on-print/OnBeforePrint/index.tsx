import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import { TestComponent } from "../ComponentToPrint";

  
export const BasicComponent: React.FC = () => {
  const printViewRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printViewRef,
    onAfterPrint: () => {
        console.log('ok พิมพ์เสร็จแล้ว')
    }
  });
  return (
    <div>
     <button onClick={() => handlePrint()}>Print CV</button>
     <div style={{display: 'none'}}>
     <div ref={printViewRef}>
       <TestComponent/>
      </div>
      </div>
    </div>
  );
};