<template>
    <!-- <v-container>
    <v-row>
      <v-col>
        <v-text-field
          placeholder="Họ Tên"
          type="text"
          v-model="name"
          color
        ></v-text-field>
        <v-text-field
          placeholder="Lớp"
          type="text"
          v-model="className"
          color
        ></v-text-field>
        <v-date-picker v-model="birthday"></v-date-picker>

        <v-btn @click="add(name, birthday, className)">add</v-btn>
      </v-col>
      <v-col>
        <a :href="studentId" download>
          <v-img :src="studentId"></v-img>
          
        </a>
      </v-col>
    </v-row>
  </v-container> -->

    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-text-field
                            class="ml-2"
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                        ></v-text-field>
                        <v-btn
                            class="ml-4"
                            color="primary"
                            @click="dialog = true"
                            dark
                            >Thêm học sinh</v-btn
                        >
                    </v-card-title>
                    <v-card-text>
                        <v-data-table
                            :headers="headers"
                            :items="items"
                            class="elevation-1"
                            loading="true"
                            :search="search"
                        >
                            <template v-slot:item.actions="{ item }">
                                <v-icon small class="mr-2" @click="show(item)">
                                    mdi-eye
                                </v-icon>
                            </template>
                        </v-data-table>
                    </v-card-text>
                    <v-dialog
                        v-model="viewQr"
                        max-width="500px"
                        transition="dialog-transition"
                    >
                        <v-card>
                            <v-app-bar dark color="primary"
                                ><h3>QR</h3></v-app-bar
                            >
                            <v-card-text>
                                <v-img
                                    :src="
                                        'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' +
                                        view.id
                                    "
                                ></v-img>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="
                                        downloadImg(
                                            'https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=' +
                                                view.id,
                                            view.id + 'jpg'
                                        )
                                    "
                                >
                                    Dowload
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog
            v-model="dialog"
            max-width="500px"
            transition="dialog-transition"
        >
            <v-card>
                <v-app-bar dense dark color="primary">
                    <h3>Thêm Học Sinh</h3>
                </v-app-bar>
                <v-container>
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    placeholder="Phạm Gia Khánh"
                                    label="Họ Tên"
                                    type="text"
                                    v-model="name"
                                    color
                                ></v-text-field>
                                <v-text-field
                                    placeholder="11A7"
                                    label="Lớp"
                                    type="text"
                                    v-model="className"
                                    color
                                ></v-text-field>
                                <v-text-field
                                    placeholder="30/01/2005"
                                    label="Ngày Sinh"
                                    type="text"
                                    v-model="birthday"
                                    color
                                ></v-text-field>
                                <v-text-field
                                    placeholder="khanh30125@gmail.com"
                                    label="Email Phụ Huynh"
                                    type="text"
                                    v-model="parentEmail"
                                    color
                                ></v-text-field>
                                <v-text-field
                                    placeholder="0452406563"
                                    label="Id thẻ học sinh"
                                    type="text"
                                    v-model="id"
                                    color
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            text
                            color="primary"
                            @click="add(name, birthday, className, parentEmail)"
                        >
                            Thêm
                        </v-btn>
                        <v-btn
                            text
                            color="success"
                            @click="
                                () => {
                                    dialog = false;
                                    excelDia = true;
                                }
                            "
                            >Thêm bằng Excel</v-btn
                        >
                        <v-dialog v-model="excelDia" max-width="300px">
                            <v-card>
                                <v-app-bar dark color="primary">
                                    <h3>Thêm Excel</h3>
                                </v-app-bar>
                                <v-card-text>
                                    <v-file-input
                                        v-model="file"
                                        @change="readFile(file)"
                                        small-chips
                                        truncate-length="15"
                                    ></v-file-input>
                                    <v-dialog
                                        v-model="list"
                                        scrollable
                                        max-width="800px"
                                        transition="dialog-transition"
                                    >
                                        <v-card>
                                            <v-app-bar
                                                dark
                                                dense
                                                color="primary"
                                            >
                                                <h3>Danh Sách Sẽ Thêm</h3>
                                            </v-app-bar>
                                            <v-card-text class="pt-5">
                                                <v-simple-table
                                                    fixed-header
                                                    height="400px"
                                                >
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    class="
                                                                        text-left
                                                                    "
                                                                >
                                                                    Tên
                                                                </th>
                                                                <th
                                                                    class="
                                                                        text-left
                                                                    "
                                                                >
                                                                    Lớp
                                                                </th>
                                                                <th
                                                                    class="
                                                                        text-left
                                                                    "
                                                                >
                                                                    Ngày Sinh
                                                                </th>
                                                                <th
                                                                    class="
                                                                        text-left
                                                                    "
                                                                >
                                                                    Email Bố/Mẹ
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr
                                                                v-for="item in data"
                                                                :key="item.name"
                                                            >
                                                                <td>
                                                                    {{
                                                                        item.name
                                                                    }}
                                                                </td>
                                                                <td>
                                                                    {{
                                                                        item.class
                                                                    }}
                                                                </td>
                                                                <td>
                                                                    {{
                                                                        item.birthday
                                                                    }}
                                                                </td>
                                                                <td>
                                                                    {{
                                                                        item.parentEmail
                                                                    }}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn
                                                    color="error"
                                                    @click="
                                                        () => {
                                                            data = [];
                                                            list = false;
                                                            file=null
                                                        }
                                                    "
                                                    >Hủy</v-btn
                                                >
                                                <v-btn
                                                    color="success"
                                                    @click="upload(data)"
                                                    >Xác nhận thêm</v-btn
                                                >
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import {
    collection,
    setDoc,
    doc,
    getFirestore,
    getDocs,
    onSnapshot,
} from "firebase/firestore";

export default {
    data: () => ({
        excelDia: false,
        viewQr: false,
        name: null,
        className: null,
        birthday: null,
        dialog: false,
        items: [],
        search: "",
        headers: [
            { text: "Họ Tên", value: "name" },
            { text: "Ngày Sinh", value: "birthday" },
            { text: "Lớp", value: "class" },
            { text: "View", value: "actions" },
        ],
        view: {},
        menu2: false,
        parentEmail: null,
        list:false,
        file:null,
        data:[],
        id:null,
    }),
    beforeMount() {
        const db = getFirestore();
        onSnapshot(collection(db, "students"), (data) => {
            //console.log(data);
            let items = [];
            data.forEach((item) => {
                items.push({
                    name: item.data().name,
                    birthday: item.data().birthday,
                    class: item.data().class,
                    id: item.id,
                });
                this.items = items;
            });
            //console.log(this.items);
        });
    },
    methods: {
        add(name, birthday, className, parentEmail,id) {
            if (name && className && birthday&&id) {
                const db = getFirestore();
                setDoc(doc(db, "students",id), {
                    name: name,
                    birthday: birthday,
                    class: className,
                    parentEmail: parentEmail,
                    id: id
                }).then(() => {
                    getDocs(collection(db, "students")).then((data) => {
                        data.forEach((item) => {
                            console.log(item.data());
                        });
                        console.log(data.docs[data.docs.length - 1].id);
                    });
                }).catch((err)=>{console.log});
            }
            this.className = null;
            this.birthday = null;
            this.name = null;
            this.dialog = false;
        },
        downloadImg(url, filename) {
            fetch(url)
                .then((response) => response.blob())
                .then((blob) => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = filename;
                    link.click();
                })
                .catch(console.error);
        },
        show(item) {
            this.view = item;
            this.viewQr = true;
        },
        readFile(selectedFile) {
            if (selectedFile) {
                this.list = true;
                this.excelDia=false;
                let fileReader = new FileReader();
                fileReader.readAsBinaryString(selectedFile);
                fileReader.onload = (event) => {
                    let data = event.target.result;
                    let workbook = XLSX.read(data, { type: "binary" });
                    console.log(workbook);
                    workbook.SheetNames.forEach((sheet) => {
                        let rowObject = XLSX.utils.sheet_to_row_object_array(
                            workbook.Sheets[sheet]
                        );
                        rowObject.forEach((row) => {
                            const data = Object.values(row);
                            console.log(data);

                            this.data.push({
                                name: data[0],
                                class: data[1],
                                birthday: data[2],
                                parentEmail: data[3],
                                id: data[4],
                            });
                        });
                    });
                };
            }
        },
        upload(data){
            data.forEach(student=>{
                this.add(student.name,student.birthday,student.class,student.parentEmail,student.id);
            })
            this.data=false;
            this.list=false;
            this.file=null;
        }
    },
};
</script>

<style lang="css" scoped></style>
