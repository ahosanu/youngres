<template>
    <div>
        <nav class="navbar navbar-expand ">
            <div class="container">
                <a class="navbar-brand" href="#">

                </a>
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a  href="#" class="nav-link"><font-awesome-icon :icon="['fab' , 'facebook-f']"/></a>
                    </li>
                    <li class="nav-item">
                        <a  href="#" class="nav-link"><font-awesome-icon :icon="['fab' , 'linkedin-in']"/></a>
                    </li>
                    <li class="nav-item">
                        <a  href="#" class="nav-link"><font-awesome-icon :icon="['fab' , 'twitter']"/></a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>


</template>

<script>

    export default {
        props: {
            login: {
                type: Boolean
            },
            userName: {
                type: String
            },
            userID: {
                type: Number
            }
        },
        methods: {
            logout(){
                this.$emit('loginInfo', {
                    userName: null,
                    login: false,
                    userID: 0
                });
            }
        }
    }
</script>

<style scoped lang="scss">



    nav{
        background: #e35219;
        padding: 0;

        a{
            color: white;
        }
    }
</style>
