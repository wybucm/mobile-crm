export default{
    keepPages: state => {
        let arr = [];
        state.keepPages.forEach((item)=>{
            arr.push(item.path);
        });
        let set = new Set([...arr, ...state.keepForever]);
        //为需要缓存的页面的父页面也申请缓存
        set.forEach((item)=>{
            let path = '';
            item.split('/').forEach((item)=>{
                if(item){
                    path += '/'+ item;
                    set.add(path);
                }
            });
        });
        return set.toJSON().join(',');
    }
};