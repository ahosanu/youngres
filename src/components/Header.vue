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
        <div class="container">
            <div class="row">
                <div class="col-6 col-md-6">
                    <img src="@/assets/logo2.png" class="logo">
                </div>
                <div class="col-6 col-md-6 content">
                    Welcome, <strong>Teacher1</strong>
                    <button class="btn btn-res"> logout</button>
                </div>
            </div>
        </div>
    </div>


</template>

<script>

    export default {

    }
</script>

<style scoped lang="scss">

    .logo{
        width: 210px;
    }

    .content{
        align-self: center;
        text-align: right;
        .btn-res{
            border-radius: 0;
            color: #fff;
            background-color: #e35219;
            border-color: #dc3545;
            padding: 4px 16px;
            margin-left: 10px;
        }
    }
    nav{
        background: #e35219;
        padding: 0;

        a{
            color: white;
        }
    }
</style>
