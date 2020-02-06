interface ITableAction {
    name: string;
    setIcon: (obj: Object) => string;
    setColor: (obj: Object) => string;
}

interface ITableActionEvent {
    actionName: string;
    obj: any;
}
