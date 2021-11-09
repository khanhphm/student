<template>
    <v-container>
        <v-row>
            <v-col>
                <v-text-field
                    ref="input"
                    type="text"
                    v-model="text"
                    @keypress.enter="show()"
                    @blur="unfo()"
                    autofocus
                ></v-text-field>
                {{ sho }}
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

export default {
    data: () => ({
        text: "",
        sho: "",
        prevText: null,
        items: [],
        headers: [
            { text: "Họ Tên", value: "name" },
            { text: "Lớp", value: "class" },
            { text: "Thời điểm điểm danh", value: "time" },
        ],
    }),
    methods: {
        unfo() {
            this.$refs.input.focus();
        },
        show() {
            const db = getFirestore();
            const id = this.text;
            this.text = "";
            getDoc(doc(db, "students", id)).then((snapStudent) => {
                console.log(this.text);

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
                            });
                        }
                    });
                } else {
                    responsiveVoice.speak(
                        "ai đi không hợp lệ",
                        "Vietnamese Female",
                        {
                            pitch: 0.9,
                        }
                    );
                }
            });
        },
        newCheck() {
            const db = getFirestore();
            //console.log('doc:',doc(db,'check','4ETOsMyw9jscqIpGtOGv'))
            getDocs(collection(db, "check")).then((data) => {
                data.forEach((item) => {
                    deleteDoc(item.ref);
                });
            });
        },
        exportExcel(data) {
            let list = [];
            if (data.length != 0) {
                data.forEach((item) => {});
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
                    //    console.log(item);0452406563

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

<style scoped>
</style>