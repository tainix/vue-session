<template>
	<div>
		<input type="hidden" :name="$session.tokenParamName" :value="$session.getToken()" />
	</div>
</template>

<script>
export default {
  name: "ss-input",
  props: "name"
};
</script>

<style>
</style>