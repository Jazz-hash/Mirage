// Welcome to the tutorial!
import {
  createServer,
  Model,
  hasMany,
  belongsTo,
  RestSerializer,
  Factory,
  trait,
} from "miragejs";

export default function (environment = "development") {
  return createServer({
    environment,
    serializers: {
      reminder: RestSerializer.extend({
        include: ["list"],
        embed: true,
      }),
    },

    models: {
      list: Model.extend({
        reminders: hasMany(),
      }),
      reminder: Model.extend({
        list: belongsTo(),
      }),
    },

    factories: {
      list: Factory.extend({
        name(i) {
          return `List ${i}`;
        },

        // afterCreate(list, server) {
        //   server.createList("reminder", 5, { list });
        // },

        // afterCreate(list, server) {
        //   if (!list.reminders.length) {
        //     server.createList("reminder", 5, { list });
        //   }
        // },

        withReminders: trait({
          afterCreate(list, server) {
            server.createList("reminder", 5, { list });
          },
        }),
      }),

      reminder: Factory.extend({
        text(i) {
          return `Reminder ${i}`;
        },
      }),
    },

    seeds(server) {
      server.create("reminder", { text: "Walk the dog" });
      server.create("reminder", { text: "Take out the trash" });
      server.create("reminder", { text: "Work out" });

      server.create("list", {
        name: "Home",
        reminders: [server.create("reminder", { text: "Do taxes" })],
      });

      server.create("list", {
        name: "Work",
        reminders: [server.create("reminder", { text: "Visit bank" })],
      });

      // Create a specific reminder
      //   server.create("reminder", { text: "Walk the dog" });

      //   server.create("list", {
      //     name: "Home",
      //     reminders: [server.create("reminder", { text: "Do taxes" })],
      //   });

      // Create 5 more generic reminders
      //   server.createList("reminder", 5);

      //   server.create("list", "withReminders"); // ? with trait

      //   server.create("list", {
      // reminders: server.createList("reminder", 5),
      //   });

      //   let homeList = server.create("list", { name: "Home" });
      //   server.create("reminder", { list: homeList, text: "Do taxes" });

      //   let workList = server.create("list", { name: "Work" });
      //   server.create("reminder", { list: workList, text: "Visit bank" });
    },

    routes() {
      this.get("/api/lists", (schema) => {
        return schema.lists.all();
      });

      this.post("/api/lists", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);

        return schema.lists.create(attrs);
      });

      this.delete("/api/lists/:id", (schema, request) => {
        let id = request.params.id;
        return schema.lists.find(id).destroy();
      });

      this.get("/api/lists/:id/reminders", (schema, request) => {
        let listId = request.params.id;
        let list = schema.lists.find(listId);

        return list.reminders;
      });

      this.get("/api/reminders", (schema) => {
        // reminders: [
        //   { id: 1, text: "Walk the dog" },
        //   { id: 2, text: "Take out the trash" },
        //   { id: 3, text: "Work out" },
        // ],
        return schema.reminders.all();
      });

      //   let newId = 4;
      this.post("/api/reminders", (schema, request) => {
        let attrs = JSON.parse(request.requestBody);
        // attrs.id = newId++;
        // console.log(attrs);

        return schema.reminders.create(attrs);
      });

      this.delete("/api/reminders/:id", (schema, request) => {
        let id = request.params.id;
        return schema.reminders.find(id).destroy();
      });
    },
  });
}
