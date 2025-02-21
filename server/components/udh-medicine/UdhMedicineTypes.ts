export type Item = {
    name: string;
    quantity: number;
    med_details: string;
    packsize: string;
    labelNo: string;
    dispcause: string; /// F
    medsts: string; // 0 ยาใหม่
};

export type PrintData = {
    HN: string;
    pname: string;
    q_dep: string;
    doctor: string;
    pay: string;
    lap: string;
    dept: string;
    allergy: string;
    type_q: string;
    item: Item[];
};