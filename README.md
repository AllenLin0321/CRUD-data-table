# CRUD Data Table
[Demo Link](https://allenlin0321.github.io/crud-data-table)
## How to Use
進入首頁的畫面
![](https://github.com/AllenLin0321/CRUD-data-table/blob/master/mdImage/screenshot_0.png?raw=true)  

新增使用者，編輯現有客戶資料以及刪除資料
![](https://github.com/AllenLin0321/CRUD-data-table/blob/master/mdImage/screenshot_1.png?raw=true)

點擊新增使用者後，會跳出輸入資料視窗
![](https://github.com/AllenLin0321/CRUD-data-table/blob/master/mdImage/screenshot_2.png?raw=true)

若資料符合規則則顯示**綠色**提示色，反之而顯示**紅色**提示色
![](https://github.com/AllenLin0321/CRUD-data-table/blob/master/mdImage/screenshot_3.png?raw=true)

![](https://github.com/AllenLin0321/CRUD-data-table/blob/master/mdImage/screenshot_4.png?raw=true)

## Design principle

此專案使用以下技術完成

  - HTML5 + CSS3
  - JaveScript，框架使用[Vue.js](https://vuejs.org/)
  - UI元件使用[Vuetify](https://vuetifyjs.com/zh-Hans/)
  - 格式驗證使用[Vuelidate](https://vuelidate.netlify.com/)

### 專案創建時會先使用Getters內的 getInitialData 方法初始預設資料
```javascript
created() {
    this.initialize();
}

initialize() {
    this.users = this.getInitialData;
}
```

### 修改以及刪除欄位資料的判斷程式碼
```‵javascript
editItem(item) {
    this.editedIndex = this.users.indexOf(item);
    this.editedItem = Object.assign({}, item);
    this.dialog = true;
},

deleteItem(item) {
    const index = this.users.indexOf(item);
    confirm("Are you sure you want to delete this user?") &&
    this.users.splice(index, 1);
}
```

### 透過editedIndex 判斷目前是要做新增使用者的動作(若為-1)，或是修改現有的用戶資料(非-1)
```javascript
//Decide the title of Dialog
formTitle() {
    return this.editedIndex === -1 ? "New User" : "Edit User";
}

//Save the User Info
save() {
      let isUnique = true;
      this.submitted = true;

      this.users.forEach((element, index) => {
        if (
          // Not the same one
          index !== this.editedIndex &&
          element.name === this.editedItem.name
        ) {
          this.showSnackbar("姓名不可重覆", "error");
          isUnique = false;
        }
      });

      // Check Name is unique and form is valid
      if (isUnique && !this.$v.$invalid) {
        // Edit User Data
        if (this.editedIndex > -1) {
          Object.assign(this.users[this.editedIndex], this.editedItem);
          this.showSnackbar("資料修改成功");
        } else {
          // It's a new User and add the serial number
          this.editedItem.no = this.users.length + 1;

          //Add into the array
          this.users.push(this.editedItem);

          this.showSnackbar("資料新增成功");
        }
        this.close();
      }
    }

```

### Vuetify 結合 Vuelidate製作資料驗證表單
```html
<v-flex xs12>
    <v-text-field
        autofocus
        v-model="editedItem.name"
        prepend-icon="person"
        :success="!$v.editedItem.name.$invalid"
        :error="submitted && $v.editedItem.name.$invalid"
        label="User Name"
    ></v-text-field>
</v-flex>
<v-flex xs12>
    <v-text-field
        v-model="editedItem.phone"
        prepend-icon="phone"
        :success="!$v.editedItem.phone.$invalid"
        :error="submitted && $v.editedItem.phone.$invalid"
        label="Phone"
        placeholder="(02)-1234-5678"
        mask="(##) #### - ####"
    ></v-text-field>
</v-flex>
<v-flex xs12>
    <v-text-field
        v-model="editedItem.email"
        :success="!$v.editedItem.email.$invalid"
        :error="submitted && $v.editedItem.email.$invalid"
        prepend-icon="email"
        label="Email"
        ></v-text-field>
</v-flex>
```