$("#grid_table").jsGrid({
    width: "100%",
    height: "400px",

    filtering: true,
    inserting: true,
    editing: true,
    sorting: true,
    pacging: true,
    autoload: true,
    pageSize: 10,
    pageButtonCount: 5,
    deleteConfirm: "Do you really want to delete data?",

    controller: {
      loadData: function (filter) {
        return $.ajax({
          type: "GET",
          url: "services/get.php",
          data: filter,
        });
      },
      insertItem: function (item) {
        return $.ajax({
          type: "POST",
          url: "services/post.php",
          data: item,
        });
      },
      updateItem: function (item) {
        return $.ajax({
          type: "PUT",
          url: "services/put.php",
          data: item,
        });
      },
      deleteItem: function (item) {
        return $.ajax({
          type: "DELETE",
          url: "services/delete.php",
          data: item,
        });
      },
    },

    fields: [
      {
        name: "id",
        type: "hidden",
        css: "hide",
      },
      {
        name: "first_name",
        type: "text",
        width: 150,
        validate: "required",
      },
      {
        name: "last_name",
        type: "text",
        width: 150,
        validate: "required",
      },
      {
        name: "age",
        type: "text",
        width: 50,
        validate: function (value) {
          if (value > 0) {
            return true;
          }
        },
      },
      {
        name: "gender",
        type: "select",
        items: [
          { Name: "", Id: "" },
          { Name: "Male", Id: "male" },
          { Name: "Female", Id: "female" },
        ],
        valueField: "Id",
        textField: "Name",
        validate: "required",
      },
      {
        type: "control",
      },
    ],
  });