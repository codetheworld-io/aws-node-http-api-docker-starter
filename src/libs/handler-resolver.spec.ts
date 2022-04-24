import { handlerPath } from './handler-resolver';

describe('HandlerResolver', () => {
  describe('handlerPath()', () => {
    it('should return absolute path of current content', () => {
      const projectRelativePath = '/Users/foo/workspaces/my-repo';
      const handlerServerlessPath = 'src/functions/movies/handler.main';
      const context = `${projectRelativePath}/${handlerServerlessPath}`;
      jest.spyOn(process, 'cwd').mockReturnValue(projectRelativePath);

      const actual = handlerPath(context);

      expect(process.cwd).toHaveBeenCalled();
      expect(actual).toEqual(handlerServerlessPath);
    });
  });
});
