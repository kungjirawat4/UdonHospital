import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import { FaRegCircleQuestion } from "react-icons/fa6";

export default function StatusModal() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <Button onPress={onOpen}  variant="light"><FaRegCircleQuestion className="text-xl" /></Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">คำอธิบาย</ModalHeader>
                            <ModalBody>
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-orange-200 rounded-full "></div>
                                    <span className=" font-bold">รอจับคู่ตะกร้า</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                                    <span className=" font-bold">กำลังจัดยา</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                    <span className=" font-bold">กำลังตรวจสอบ</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                                    <span className=" font-bold">จัดยาเสร็จแล้ว</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-pink-500 rounded-full"></div>
                                    <span className=" font-bold">มีใบแนบ</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                                    <span className=" font-bold">ยกเลิก</span>
                                </div>
                            </ModalBody>
                            <ModalFooter />


                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
