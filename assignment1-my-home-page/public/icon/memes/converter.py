import os

# 获取当前脚本所在目录
current_dir = os.path.dirname(os.path.abspath(__file__))

i = 0
# 遍历目录下的文件
for filename in os.listdir(current_dir):
    # 判断文件名是否符合要求
    if filename.startswith('games'):
        # 构建新的文件名
        new_filename = f"gameicon_{str(i).zfill(3)}.jpg"
        # 重命名文件
        os.rename(os.path.join(current_dir, filename), os.path.join(current_dir, new_filename))
        i += 1