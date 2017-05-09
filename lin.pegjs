start=a:(_(num/key)_)+{return a.map(x=>x[1])}
num=$(int"."?/int?"." int)
int=$[0-9]+
key=$[^0-9. ]+
_=' '*
