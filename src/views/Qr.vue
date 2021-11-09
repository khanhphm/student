<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-app-bar dense dark color="primary"
                        ><h3>Quét Qr</h3>
                    </v-app-bar>
                    <v-card-text>
                        <v-switch
                            @change="toggleCam()"
                            label="Bật/Tắt máy"
                        ></v-switch>
                        <qrcode-stream
                            @decode="onDecode"
                            @init="onInit"
                            :track="paintCenterText"
                            :camera="camera"
                            v-show="camera == 'auto'"
                        />
                        {{ error }}
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-app-bar color="primary" dense dark>
                        <h3>Danh sách đã điểm danh</h3>
                    </v-app-bar>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-data-table
                                        :items-per-page="10"
                                        :headers="headers"
                                        :items="items"
                                    >
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn text color="primary" @click="sendToParent()">
                            Gửi Email cho phụ huynh
                        </v-btn>

                        <v-spacer></v-spacer>
                        <v-btn @click="exportExcel(items)" text color="error"
                            >Kết thúc phiên điểm danh</v-btn
                        >
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    onSnapshot,
    setDoc,
} from "@firebase/firestore";
import { init, send } from "emailjs-com";
import XLXS from "xlsx";
console.log(XLXS);
export default {
    data: () => ({
        items: [],
        headers: [
            { text: "Họ Tên", value: "name" },
            { text: "Lớp", value: "class" },
            { text: "Thời điểm điểm danh", value: "time" },
        ],
        camera: "off",
        error: "",
    }),
    methods: {
        newCheck() {
            const db = getFirestore();
            //console.log('doc:',doc(db,'check','4ETOsMyw9jscqIpGtOGv'))
            getDocs(collection(db, "check")).then((data) => {
                data.forEach((item) => {
                    deleteDoc(item.ref);
                });
            });
        },

        toggleCam() {
            if (this.camera == "off") {
                this.camera = "auto";
            } else if (this.camera == "auto") {
                this.camera = "off";
                this.error = "";
            }
        },
        onDecode(id) {
            function validURL(str) {
                var pattern = new RegExp(
                    "^(https?:\\/\\/)?" + // protocol
                        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
                        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
                        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
                        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
                        "(\\#[-a-z\\d_]*)?$",
                    "i"
                ); // fragment locator
                return !!pattern.test(str);
            }
            if (validURL(id)) {
                responsiveVoice.speak(
                    "mã qr không hợp lệ",
                    "Vietnamese Female",
                    {
                        pitch: 0.9,
                    }
                );
                return;
            }

            console.log(id);
            const db = getFirestore();
            getDoc(doc(db, "students", id)).then((snapStudent) => {
                if (snapStudent.data()) {
                    const student = snapStudent.data();
                    getDoc(doc(db, "check", id)).then((snap) => {
                        const data = snap.data();
                        console.log(data);
                        if (!data) {
                            const date = new Date();
                            setDoc(doc(db, "check", id), {
                                time: date.getTime(),
                                name: student.name,
                                birthday: student.birthday,
                                class: student.class,
                                parentEmail: student.parentEmail,
                            }).then(() => {
                                responsiveVoice.speak(
                                    snapStudent.data().name +
                                        ", lớp " +
                                        snapStudent.data().class +
                                        " điểm danh thành công",
                                    "Vietnamese Female",
                                    { pitch: 0.9 }
                                );
                            });
                        } else {
                            responsiveVoice.speak(
                                snapStudent.data().name +
                                    ", lớp " +
                                    snapStudent.data().class +
                                    " Đã điểm danh lúc " +
                                    new Date(data.time).getHours() +
                                    " Giờ " +
                                    new Date(data.time).getMinutes() +
                                    " phút",
                                "Vietnamese Female",
                                { pitch: 0.9 }
                            );
                        }
                    });
                } else {
                    responsiveVoice.speak(
                        "mã quy rờ không hợp lệ",
                        "Vietnamese Female",
                        {
                            pitch: 0.9,
                        }
                    );
                }
            });
        },
        async onInit(promise) {
            try {
                await promise;
            } catch (error) {
                if (error.name === "NotAllowedError") {
                    this.error =
                        "ERROR: you need to grant camera access permission";
                } else if (error.name === "NotFoundError") {
                    this.error = "ERROR: no camera on this device";
                } else if (error.name === "NotSupportedError") {
                    this.error =
                        "ERROR: secure context required (HTTPS, localhost)";
                } else if (error.name === "NotReadableError") {
                    this.error = "ERROR: is the camera already in use?";
                } else if (error.name === "OverconstrainedError") {
                    this.error = "ERROR: installed cameras are not suitable";
                } else if (error.name === "StreamApiNotSupportedError") {
                    this.error =
                        "ERROR: Stream API is not supported in this browser";
                } else if (error.name === "InsecureContextError") {
                    this.error =
                        "ERROR: Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.";
                } else {
                    this.error = `ERROR: Camera error (${error.name})`;
                }
            }
        },
        paintCenterText(detectedCodes, ctx) {
            for (const detectedCode of detectedCodes) {
                const { boundingBox, rawValue } = detectedCode;

                const centerX = boundingBox.x + boundingBox.width / 2;
                const centerY = boundingBox.y + boundingBox.height / 2;

                const fontSize = Math.max(
                    12,
                    (50 * boundingBox.width) / ctx.canvas.width
                );
                console.log(boundingBox.width, ctx.canvas.width);

                ctx.font = `bold ${fontSize}px sans-serif`;
                ctx.textAlign = "center";

                ctx.lineWidth = 3;
                ctx.strokeStyle = "#35495e";
                ctx.strokeText(detectedCode.rawValue, centerX, centerY);

                ctx.fillStyle = "#5cb984";
                ctx.fillText(rawValue, centerX, centerY);
            }
        },
        exportExcel(data) {
            if (data.length != 0) {
                const filename =
                    "Danh sách điểm danh " + new Date().toLocaleDateString()+'.xlsx';

                var ws = XLSX.utils.json_to_sheet(data);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "People");
                XLSX.writeFile(wb, filename);
                this.newCheck();
            } else {
                alert("Không có dữ liệu");
            }

        },

        async sendToParent() {
            //send('service_v9o224x', 'template_24rji8p', {reply_to:"zed30125@gmail.com",message:"KKK",from_name:"THPT LY NHAN"}, 'user_83VIvzISmWkaWmfhR3KpA')
            const db = getFirestore();
            const checkedList = (
                await getDocs(collection(db, "check"))
            ).docs.map((student) => ({
                name: student.data().name,
                parentEmail: student.data().parentEmail,
            }));
            const studentList = (
                await getDocs(collection(db, "students"))
            ).docs.map((student) => ({
                name: student.data().name,
                parentEmail: student.data().parentEmail,
            }));

            studentList.forEach((item) => {
                const message =
                    "Hôm nay bạn " + item.name + " không điểm danh trước 7h20p";
                const email = item.parentEmail;
                if (
                    !checkedList.some((i) => {
                        return (
                            i.name === item.name &&
                            i.parentEmail === item.parentEmail
                        );
                    })
                ) {
                    console.log(item);
                    send(
                        "service_v9o224x",
                        "template_24rji8p",
                        {
                            reply_to: email,
                            message: message,
                            from_name: "THPT LY NHAN",
                        },
                        "user_83VIvzISmWkaWmfhR3KpA"
                    );
                }
            });

            //console.log(studentList, checkedList);
        },
    },
    beforeMount() {
        init("user_83VIvzISmWkaWmfhR3KpA");
        const db = getFirestore();
        onSnapshot(collection(db, "check"), (data) => {
            //console.log(data);
            if (data) {
                let items = [];
                data.forEach((data) => {
                    let item = data.data();
                    //    console.log(item);
                    items.push({
                        name: item.name,
                        class: item.class,
                        time:
                            new Date(item.time).getHours() +
                            ":" +
                            new Date(item.time).getMinutes(),
                    });
                });
                this.items = items;
                // console.log(this.items);
            }
        });
    },
};
</script>

<style lang="css" scoped></style>
